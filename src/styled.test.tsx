import React from 'react';
import { render } from '@testing-library/react';
import { styled } from './styled';
import { _keyCounts } from './react/useStyle';
import { styledSelectorMarker } from './constants';
import { assign } from './utils/assign';

test('injects styles into the head', () => {
  const A = styled('div', 'A')`
    color: red;
  `;

  const { container } = render(<A />);
  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_1xbxizv"
  >
    ._1xbxizv {
  color: red;
}

  </style>
</head>
`);
  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    class="A-3t2c _1xbxizv"
  />
</div>
`);
});

test('overrides styled component styles (only one style should be injected)', () => {
  const A = styled('div', 'A')`
    color: red;
  `;
  const B = styled(A, 'B')`
    color: blue;
  `;
  const { container } = render(<B />);

  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_12tdhwp"
  >
    ._12tdhwp {
  color: red;
  color: blue;
}

  </style>
</head>
`);
  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    class="B-3t2f A-3t2c _12tdhwp"
  />
</div>
`);
});

test('deduplicates styles and removes styles that are no longer used (injection order matters)', () => {
  const A = styled('div').props<{ color?: string }>()`
    color: ${(props) => props.color ?? 'red'};
  `;

  const { rerender } = render(
    <>
      <A />
      <A />
    </>,
  );
  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_g0zrt6"
  >
    ._g0zrt6 {
  color: red;
}

  </style>
</head>
`);

  rerender(
    <>
      <A />
      <A color={'blue'} />
    </>,
  );
  jest.runAllTimers();
  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_g0zrt6"
  >
    ._g0zrt6 {
  color: red;
}

  </style>
  <style
    data-tss="_cilhif"
  >
    ._cilhif {
  color: blue;
}

  </style>
</head>
`);

  rerender(
    <>
      <A />
    </>,
  );
  jest.runAllTimers();
  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_g0zrt6"
  >
    ._g0zrt6 {
  color: red;
}

  </style>
</head>
`);

  rerender(<></>);
  jest.runAllTimers();
  expect(document.head).toMatchInlineSnapshot(`<head />`);
});

test('treats styled "style" elements as global styles (injection order matters)', () => {
  const GlobalStyleA = styled('style')`
    color: red;
  `;
  const GlobalStyleB = styled('style', 'GlobalStyleB')`
    color: red;
  `;

  const { container } = render(
    <>
      <GlobalStyleA />
      <GlobalStyleB />
    </>,
  );
  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_g0zrt6"
  >
    :root {
  color: red;
}

  </style>
  <style
    data-tss="_1vz3xf8"
  >
    :root {
  color: red;
}

  </style>
</head>
`);
  expect(container).toMatchInlineSnapshot(`<div />`);
});

test('only styled components with a display name should support "component selector" use', () => {
  const A = styled('div', 'A')``;
  const B = styled('div')``;

  expect(A[styledSelectorMarker]).toBe(true);
  expect(`${A}`).toMatchInlineSnapshot(`".A-3t2c"`);
  expect(styledSelectorMarker in B).toBe(false);
});

test('default display names', () => {
  const A = () => null;
  const B = assign(() => null, { displayName: 'Foo' });

  expect(styled('div')``.displayName).toMatchInlineSnapshot(`"$$styled('div')"`);
  expect(styled(A)``.displayName).toMatchInlineSnapshot(`"$$styled(A)"`);
  expect(styled(B)``.displayName).toMatchInlineSnapshot(`"$$styled(Foo)"`);
  expect(styled(() => null)``.displayName).toMatchInlineSnapshot(`"$$styled()"`);
});

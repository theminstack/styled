import React, { createRef, forwardRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { styled } from './styled';
import { styledComponentMarker } from './constants';
import { assign } from './utils/assign';

declare const Symbol: (...args: any[]) => symbol;

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
        data-tss="_ikj0kj"
      >
        ._ikj0kj {
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
        data-tss="_ikj0kj"
      >
        ._ikj0kj {
      color: red;
    }

      </style>
      <style
        data-tss="_dpgp4e"
      >
        ._dpgp4e {
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
        data-tss="_ikj0kj"
      >
        ._ikj0kj {
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
        data-tss="_rvszkf"
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

  expect(A[styledComponentMarker]).toBe(true);
  expect(`${A}`).toMatchInlineSnapshot(`".A-3t2c"`);
  expect(B[styledComponentMarker]).toBe(false);
});

test('default display names', () => {
  const A = () => null;
  const B = assign(() => null, { displayName: 'Foo' });

  expect(styled('div')``.displayName).toMatchInlineSnapshot(`"$$styled('div')"`);
  expect(styled(A)``.displayName).toMatchInlineSnapshot(`"$$styled(A)"`);
  expect(styled(B)``.displayName).toMatchInlineSnapshot(`"$$styled(Foo)"`);
  expect(styled(() => null)``.displayName).toMatchInlineSnapshot(`"$$styled()"`);
});

test('prop mapping methods', () => {
  const A = styled('div')
    .props((props: { foo: string; ignored: boolean; optional?: string }) => ({
      bar: props.foo,
      optional: props.optional,
    }))
    .set((props) => ({
      bar: `set ${props.bar}`,
      internal: '123',
    }))
    .use((props) => ({
      bar: 'should not be used',
      optional: JSON.stringify(props),
    }))
    .map((props) => ({
      object: {},
      function: () => undefined,
      nul: null,
      undef: undefined,
      symbol: Symbol(),
      bar: `map ${props.bar}`,
      optional: `map ${props.optional}`,
      $mappedInternal: props.internal,
    }))`
    content: '${(props) => JSON.stringify(props)}';
  `;

  const { container } = render(<A foo={'abc'} ignored />);
  expect(document.head).toMatchInlineSnapshot(`
<head>
  <style
    data-tss="_vjkoiy"
  >
    ._vjkoiy {
  content: '{"object":{},"nul":null,"bar":"map set abc","optional":"map {\\"bar\\":\\"set abc\\",\\"internal\\":\\"123\\"}","$mappedInternal":"123"}';
}

  </style>
</head>
`);
  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    bar="map set abc"
    class="_vjkoiy"
    optional="map {\\"bar\\":\\"set abc\\",\\"internal\\":\\"123\\"}"
  />
</div>
`);
});

test('ref forwarding', () => {
  const A = forwardRef<string, { className?: string }>(function A(props, ref) {
    if (typeof ref === 'function') {
      ref('refValue');
    } else if (ref != null) {
      ref.current = 'refValue';
    }
    return null;
  });
  const B = styled(A)``;
  const C = styled('div')``;

  const refB = createRef<string>();
  const refC = createRef<HTMLDivElement>();

  render(
    <>
      <B ref={refB} />
      <C ref={refC} />
    </>,
  );

  expect(refB.current).toBe('refValue');
  expect(refC.current).toBeInstanceOf(HTMLDivElement);
});

test('HTML element props are filtered', () => {
  const A = styled('div').props<any>()``;
  const onClick = jest.fn();
  const { container } = render(
    <A $data={'$'} obj={{}} style={{}} onClick={onClick} str={'s'} num={1} readOnly={true}>
      child
    </A>,
  );

  fireEvent(
    container.firstChild as ChildNode,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="_1f8sca4"
  num="1"
  readonly=""
  str="s"
>
  child
</div>
`);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('React component props are not filtered', () => {
  function A({ onClick, children, ...props }: any) {
    return (
      <div onClick={onClick}>
        {JSON.stringify(props)}
        {children}
      </div>
    );
  }
  const B = styled(A)``;
  const onClick = jest.fn();
  const { container } = render(
    <B $data={'$'} obj={{}} style={{}} onClick={onClick} str={'s'} num={1} readOnly={true}>
      child
    </B>,
  );

  fireEvent(
    container.firstChild as ChildNode,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
<div>
  {"$data":"$","obj":{},"style":{},"str":"s","num":1,"readOnly":true,"className":"_1emgcpi"}
  child
</div>
`);
  expect(onClick).toHaveBeenCalledTimes(1);
});

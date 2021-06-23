import React from 'react';
import { render } from '@testing-library/react';
import { styled } from './styled';
import { defaultStyleManager } from './DefaultStyleManager';
import { StyleConfig } from './react/StyleConfig';

jest.mock('./constants', () => ({ ...jest.requireActual('./constants'), isClient: false }));

test('inlined style', () => {
  const A = styled('div')`
    color: red;
  `;
  const B = styled('div')`
    color: blue;
  `;

  const { container } = render(
    <>
      <A />
      <A />
      <B />
    </>,
  );
  expect(document.head).toMatchInlineSnapshot(`<head />`);
  expect(container).toMatchInlineSnapshot(`
<div>
  <style
    data-tss=""
  >
    ._ikj0kj {
  color: red;
}

  </style>
  <div
    class="_ikj0kj"
  />
  <div
    class="_ikj0kj"
  />
  <style
    data-tss=""
  >
    ._dpgp4e {
  color: blue;
}

  </style>
  <div
    class="_dpgp4e"
  />
</div>
`);
});

test('SSR custom style manager', () => {
  const A = styled('div')`
    color: blue;
  `;

  const sm = defaultStyleManager;
  const spyAdd = jest.spyOn(sm, 'add');

  render(
    <StyleConfig serverManager={sm}>
      <A />
    </StyleConfig>,
  );

  expect(spyAdd).toHaveBeenCalledTimes(1);
  expect(spyAdd).toHaveBeenLastCalledWith(expect.stringMatching(/^_[a-z0-9]+$/i), expect.any(HTMLStyleElement));
});

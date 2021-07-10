import React from 'react';
import { render } from '@testing-library/react';
import { styled } from './styled';
import { defaultStyleManager } from './DefaultStyleManager';
import { StyleConfig } from './react/StyleConfig';
import { ServerStyleManager } from './ServerStyleManager';

(window as any).__webpack_nonce__ = 'webpack-test-nonce';
jest.mock('./constants', () => ({ ...jest.requireActual('./constants'), isClient: false, version: '1.0.0-test' }));

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
  expect(spyAdd).toHaveBeenLastCalledWith(
    expect.objectContaining({
      key: expect.stringMatching(/^_[a-z0-9]+$/i),
      cssText: expect.stringContaining('color: blue;'),
    }),
  );
});

test('ServerStyleManager captures styles', () => {
  const manager = new ServerStyleManager();
  const A = styled('div')`
    color: red;
  `;
  const B = styled('div')`
    color: blue;
  `;

  render(
    <StyleConfig serverManager={manager}>
      <A />
      <B />
    </StyleConfig>,
  );

  const styleElement = manager.getStyleElement();

  expect(styleElement.props).toMatchInlineSnapshot(`
Object {
  "children": "._ikj0kj {
  color: red;
}

._dpgp4e {
  color: blue;
}
",
  "data-tss": "",
  "data-tss-nonce": "webpack-test-nonce",
  "data-tss-version": "1.0.0-test",
}
`);
  expect(manager.getStyleData()).toMatchInlineSnapshot(`
Array [
  Object {
    "cssText": "._ikj0kj {
  color: red;
}
",
    "key": "_ikj0kj",
  },
  Object {
    "cssText": "._dpgp4e {
  color: blue;
}
",
    "key": "_dpgp4e",
  },
]
`);
  expect(manager.getStyleTag()).toMatchInlineSnapshot(`
"<style data-tss data-tss-version=\\"1.0.0-test\\" data-tss-nonce=\\"webpack-test-nonce\\">._ikj0kj {
  color: red;
}

._dpgp4e {
  color: blue;
}
</style>"
`);
});

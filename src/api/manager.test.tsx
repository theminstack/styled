import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { createSsrStyledManager, createStyledManager, styled, StyledProvider } from '../index.js';

describe('StyledManager', () => {
  test('nonce', () => {
    const A = styled.div`
      color: red;
    `;
    const manager = createStyledManager('123');
    render(
      <StyledProvider manager={manager}>
        <A />
      </StyledProvider>,
    );
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style
          data-styled="rms"
          nonce="123"
        >
          ._rmsd58sss8_ {
        color: red;
      }
        </style>
      </head>
    `);
  });

  test('SSR nonce', () => {
    const A = styled.div`
      color: red;
    `;
    const manager = createSsrStyledManager('123');
    render(
      <StyledProvider manager={manager}>
        <A />
      </StyledProvider>,
    );
    expect(manager.getStyleElement()).toMatchInlineSnapshot(`
      [
        <style
          data-styled-ssr="rms"
          nonce="123"
        >
          ._rmsd58sss8_ {
        color: red;
      }
        </style>,
      ]
    `);
    expect(manager.getStyleTags()).toMatchInlineSnapshot(`
      "<style data-styled-ssr="rms" nonce="123">._rmsd58sss8_ {
        color: red;
      }</style>"
    `);
  });

  test('createSsrStyledManager', async () => {
    const A = styled.div`
      color: red;
    `;
    const B = styled.global`
      padding: 1rem;
    `;
    const manager = createSsrStyledManager();
    const html = renderToString(
      <StyledProvider manager={manager}>
        <A />
        <B />
      </StyledProvider>,
    );
    expect(html).toMatchInlineSnapshot(`"<div class="_rmsd58sss8_ _rmsswo5o5a_"></div>"`);
    expect(manager.getStyleElement()).toMatchInlineSnapshot(`
      [
        <style
          data-styled-ssr="rms"
        >
          :root {
        padding: 1rem;
      }
        </style>,
        <style
          data-styled-ssr="rms"
        >
          ._rmsd58sss8_ {
        color: red;
      }
        </style>,
      ]
    `);
    expect(manager.getStyleTags()).toMatchInlineSnapshot(`
      "<style data-styled-ssr="rms">:root {
        padding: 1rem;
      }</style>
      <style data-styled-ssr="rms">._rmsd58sss8_ {
        color: red;
      }</style>"
    `);
    expect(manager.getCss()).toMatchInlineSnapshot(`
      [
        ":root {
        padding: 1rem;
      }",
        "._rmsd58sss8_ {
        color: red;
      }",
      ]
    `);
  });
});

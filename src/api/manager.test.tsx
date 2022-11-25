import { renderToString } from 'react-dom/server';

import { createSsrStyledManager, styled, StyledProvider } from '../index.js';

describe('createSsrStyledManager', () => {
  test('capture styles', async () => {
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

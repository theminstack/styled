import { compile } from './compile.js';
import { format } from './format.js';

describe('format', () => {
  test('global', () => {
    const ast = compile(`
      color: blue;
      :root {
        color: white;
      }
      & {
        color: orange;
      }
      .foo {
        color: red;
        & {
          color: yellow;
        }
        && {
          color: green;
        }
      }
      .foo & {
        color: pink;
      }
    `);

    expect(format(ast)).toMatchInlineSnapshot(`
      ":root {
        color: blue;
      }
      :root {
        color: white;
      }
      :root {
        color: orange;
      }
      .foo {
        color: red;
      }
      .foo {
        color: yellow;
      }
      .foo.foo {
        color: green;
      }
      .foo :root {
        color: pink;
      }"
    `);
  });

  test('scoped', () => {
    const ast = compile(`
      color: blue;
      .foo {
        .empty {
          .empty {}
        }
        :hover {
          color: black;
        }
        &:hover {
          color: gray;
        }
        .bar & {
          color: green;
          color: pink;
          @media screen {
            color: red;
          }
          @media screen {
            @media screen {
              color: red;
            }
          }
          @keyframes slidein {
            from {
              transform: translateX(0%);
            }
            to {
              transform: translateX(100%);
            }
          }
          @font-feature-values Font One {
            @styleset {
              nice-style: 12;
            }
          }
          color: purple
        }
        color: orange;
        color: yellow;
      }
      @media screen {
        color: red;
      }
      @media screen {
        @media screen {
          color: red;
        }
      }
      @keyframes slidein {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(100%);
        }
      }
      @font-feature-values Font One {
        @styleset {
          nice-style: 12;
        }
      }
    `);

    expect(format(ast, '.parent')).toMatchInlineSnapshot(`
      ".parent {
        color: blue;
      }
      .parent .foo :hover {
        color: black;
      }
      .parent .foo:hover {
        color: gray;
      }
      .bar .parent .foo {
        color: green;
        color: pink;
      }
      @media screen {
        .bar .parent .foo {
          color: red;
        }
      }
      @media screen {
        @media screen {
          .bar .parent .foo {
            color: red;
          }
        }
      }
      @keyframes slidein {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(100%);
        }
      }
      @font-feature-values Font One {
        @styleset {
          nice-style: 12;
        }
      }
      .bar .parent .foo {
        color: purple;
      }
      .parent .foo {
        color: orange;
        color: yellow;
      }
      @media screen {
        .parent {
          color: red;
        }
      }
      @media screen {
        @media screen {
          .parent {
            color: red;
          }
        }
      }
      @keyframes slidein {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(100%);
        }
      }
      @font-feature-values Font One {
        @styleset {
          nice-style: 12;
        }
      }"
    `);
  });
});

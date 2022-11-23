import { compile } from './compile.js';
import { format } from './format.js';

test('format', () => {
  const ast = compile(`
    color: blue;
    && {
      color: green;
    }
    .foo {
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
      && {
        color: green;
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
    @font-face {
      font-family: 'Trickster';
      src: local('Trickster'), url('trickster-COLRv1.otf') format('opentype') tech(color-COLRv1),
        url('trickster-outline.otf') format('opentype'), url('trickster-outline.woff') format('woff');
    }
  `);

  // Global
  expect(format(ast)).toMatchInlineSnapshot(`
    ":root {
      color: blue;
    }
    :root:root {
      color: green;
    }
    .foo :hover {
      color: black;
    }
    .foo:hover {
      color: gray;
    }
    .bar .foo {
      color: green;
      color: pink;
    }
    @media screen {
      .bar .foo {
        color: red;
      }
    }
    @media screen {
      @media screen {
        .bar .foo {
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
    .bar .foo {
      color: purple;
    }
    .foo.foo {
      color: green;
    }
    .foo {
      color: orange;
      color: yellow;
    }
    @media screen {
      :root {
        color: red;
      }
    }
    @media screen {
      @media screen {
        :root {
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
    @font-face {
      font-family: 'Trickster';
      src: local('Trickster'), url('trickster-COLRv1.otf') format('opentype') tech(color-COLRv1), url('trickster-outline.otf') format('opentype'), url('trickster-outline.woff') format('woff');
    }"
  `);

  // Scoped
  expect(format(ast, '.parent')).toMatchInlineSnapshot(`
    ".parent {
      color: blue;
    }
    .parent.parent {
      color: green;
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
    .parent .foo.parent .foo {
      color: green;
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
    }
    @font-face {
      font-family: 'Trickster';
      src: local('Trickster'), url('trickster-COLRv1.otf') format('opentype') tech(color-COLRv1), url('trickster-outline.otf') format('opentype'), url('trickster-outline.woff') format('woff');
    }"
  `);
});

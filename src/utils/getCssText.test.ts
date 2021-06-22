import { getCssText } from './getCssText';
import { getStyleTokens } from './getStyleTokens';
import { defaultStyleFormatter } from '../DefaultStyleFormatter';

it('should render simple css', () => {
  expect(
    getCssText(
      getStyleTokens(`
        .foo,
        .bar {
          color: red;
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    ".foo,
    .bar {
      color: red;
    }
    "
  `);
});

it('should include un-terminated rules', () => {
  expect(
    getCssText(
      getStyleTokens(`
        .foo {
          color: blue`),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    ".foo {
      color: blue;
    }
    "
  `);
});

it('should render nested css', () => {
  expect(
    getCssText(
      getStyleTokens(`
        color: white;
        .foo {
          color: red;
          .bar {
            color: blue;
          }
          color: green;
        }
        color: black;
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      color: white;
    }
    .foo {
      color: red;
    }
    .foo .bar {
      color: blue;
    }
    .foo {
      color: green;
    }
    :root {
      color: black;
    }
    "
  `);
});

it('should replace & placeholders', () => {
  expect(
    getCssText(
      getStyleTokens(`
        .foo {
          .bar & {
            color: red;
            &:hover {
              color: blue;
            }
          }
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    ".bar .foo {
      color: red;
    }
    .bar .foo:hover {
      color: blue;
    }
    "
  `);
});

it('should hoist at-rules', () => {
  expect(
    getCssText(
      getStyleTokens(`
        .foo {
          color: red;
          @media screen {
            color: orange;
            .bar {
              color: yellow;
            }
            color: lime;
          }
          color: green;
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    @media screen {
      .foo {
        color: orange;
      }
      .foo .bar {
        color: yellow;
      }
      .foo {
        color: lime;
      }
    }
    .foo {
      color: green;
    }
    "
  `);
});

it('should correctly handle nested at-rules', () => {
  expect(
    getCssText(
      getStyleTokens(`
        @charset "utf-8";
        @namespace foo;
        @import url('foo');
        @media screen0 {
          @charset "utf-8";
          @namespace bar;
          @import url('bar');
          @media screen1 {
            color: blue;
          }
          .foo {
            color: green;
            @import url('baz');
            @namespace baz;
            @media screen2 {
              color: teal;
            }
            color: purple;
          }
        }
        @keyframes foo {
          from {
            color: black;
          }
          to {
            color: white;
          }
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    "@import url('foo');
    @import url('bar');
    @import url('baz');

    @namespace foo;
    @namespace bar;
    @namespace baz;

    @media screen1 {
      :root {
        color: blue;
      }
    }
    @media screen0 {
      .foo {
        color: green;
      }
    }
    @media screen2 {
      .foo {
        color: teal;
      }
    }
    @media screen0 {
      .foo {
        color: purple;
      }
    }
    @keyframes foo {
      from {
        color: black;
      }
      to {
        color: white;
      }
    }
    "
  `);
});

it('should merge comma separated selectors', () => {
  expect(
    getCssText(
      getStyleTokens(`
        .foo,
        .bar {
          .baz {
            color: red;
          }
        }
        .zip {
          .zot,
          .zow {
            color: blue;
          }
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    ".foo .baz,
    .bar .baz {
      color: red;
    }
    .zip .zot,
    .zip .zow {
      color: blue;
    }
    "
  `);
});

it('should print other at-rule properties', () => {
  expect(
    getCssText(
      getStyleTokens(`
        @foo bar baz;
        @font-feature-values Font {
          @styleset {
            nice-style: 12;
          }
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    "@foo bar baz;

    @font-feature-values Font {
      @styleset {
        nice-style: 12;
      }
    }
    "
  `);
});

it('should not inherit parent selectors inside non-conditional-group at rules', () => {
  expect(
    getCssText(
      getStyleTokens(`
        @keyframes foo {
          from {
            color: black;
          }
          to {
            color: white;
          }
        }
        @media screen {
          color: red;
          .bar {
            color: blue;
          }
        }
        @font-feature-values Font {
          @styleset {
            nice-style: 12;
          }
        }
      `),
      defaultStyleFormatter,
      'foo',
    ),
  ).toMatchInlineSnapshot(`
    "@keyframes foo {
      from {
        color: black;
      }
      to {
        color: white;
      }
    }
    @media screen {
      .foo {
        color: red;
      }
      .foo .bar {
        color: blue;
      }
    }
    @font-feature-values Font {
      @styleset {
        nice-style: 12;
      }
    }
    "
  `);
});

it('should support @font-face rules', () => {
  expect(
    getCssText(
      getStyleTokens(`
        @font-face {
          font-family: 'Foo';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('bar.woff2') format('woff2'), url('bar.woff') format('woff');
        }
        @font-face {
          font-family: 'Bar';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('bar.woff2') format('woff2'), url('bar.woff') format('woff');
        }
      `),
      defaultStyleFormatter,
      undefined,
    ),
  ).toMatchInlineSnapshot(`
    "@font-face {
      font-family: 'Foo';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('bar.woff2') format('woff2'), url('bar.woff') format('woff');
    }
    @font-face {
      font-family: 'Bar';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('bar.woff2') format('woff2'), url('bar.woff') format('woff');
    }
    "
  `);
});

it('should not inherit parent selectors inside non-conditional-group at rules', () => {
  expect(
    getCssText(
      getStyleTokens(`
        .bar {
          &:hover {
            color: red;
          }
          &:focus {
            color: blue;
          }
        }
      `),
      defaultStyleFormatter,
      'foo',
    ),
  ).toMatchInlineSnapshot(`
    ".foo .bar:hover {
      color: red;
    }
    .foo .bar:focus {
      color: blue;
    }
    "
  `);
});

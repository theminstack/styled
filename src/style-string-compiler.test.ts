import { createStyleStringCompiler } from './style-string-compiler.js';
import { createStyled } from './styled.js';

const styled = createStyled();
const compiler = createStyleStringCompiler();

test('empty', () => {
  expect(compiler.compile(':root', '')).toMatchInlineSnapshot(`""`);
});

test('simple global declarations', () => {
  const style = `
    color: red;
    background: blue;
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    ":root {
      color: red;
      background: blue;
    }"
  `);
});

test('nesting', () => {
  const style = `
    color: black;
    .foo {
      color: red;
    }
    .foo,
    .bar {
      color: blue;
      .baz,
      .boo {
        color: purple;
      }
    }
    color: green;
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    ":root {
      color: black;
    }
    .foo {
      color: red;
    }
    .foo,
    .bar {
      color: blue;
    }
    .foo .baz,
    .bar .baz,
    .foo .boo,
    .bar .boo {
      color: purple;
    }
    :root {
      color: green;
    }"
  `);
});

test('parent selector', () => {
  const style = `
    & {
      color: red;
    }
    && {
      color: blue;
    }
    .foo,
    .bar {
      .baz &,
      .boo & {
        color: purple;
        &:hover,
        &:active {
          color: green;
        }
      }
    }
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    ":root {
      color: red;
    }
    :root:root {
      color: blue;
    }
    .baz .foo,
    .baz .bar,
    .boo .foo,
    .boo .bar {
      color: purple;
    }
    .baz .foo:hover,
    .baz .bar:hover,
    .boo .foo:hover,
    .boo .bar:hover,
    .baz .foo:active,
    .baz .bar:active,
    .boo .foo:active,
    .boo .bar:active {
      color: green;
    }"
  `);
});

test('@keyframes', () => {
  const style = `
    @keyframes foo {
      from {
        color: pink;
      }
      50% {
        color: magenta;
      }
      to {
        color: turquoise;
      }
    }
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    "@keyframes foo {
      from {
        color: pink;
      }
      50% {
        color: magenta;
      }
      to {
        color: turquoise;
      }
    }"
  `);
});

test('at-rules', () => {
  const style = `
    @charset "utf-8";
    @import;
    @ "foo";
    @import url('foo');
    @namespace url('foo');
    @bar baz;

    @media only screen and (min-width: 320px) {
      color: purple;
      : value;
      key;

      .zip {
        color: gray;

        .zot, .zoot {
          color: white;
        }
      }
    }

    .dit {
      @media only screen and (min-width: 320px) {
        color: purple;

        .zip {
          color: gray;

          .zot {
            color: white;
          }
        }
      }
    }

    @keyframes foo {
      from {
        color: pink;
      }
      50% {
        color: magenta;
      }
      to {
        color: turquoise;
      }
    }
    
    @font-feature-values Font One {
      @styleset {
        nice-style: 12;
      }
    }
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    "@import url('foo');
    @namespace url('foo');
    @bar baz;
    @media only screen and (min-width: 320px) {
      :root {
        color: purple;
      }
      .zip {
        color: gray;
      }
      .zip .zot,
      .zip .zoot {
        color: white;
      }
    }
    @media only screen and (min-width: 320px) {
      .dit {
        color: purple;
      }
      .dit .zip {
        color: gray;
      }
      .dit .zip .zot {
        color: white;
      }
    }
    @keyframes foo {
      from {
        color: pink;
      }
      50% {
        color: magenta;
      }
      to {
        color: turquoise;
      }
    }
    @font-feature-values Font One {
      @styleset {
        nice-style: 12;
      }
    }"
  `);
});

test('omit comments', () => {
  const style = `
    color: red;
    // comment
    color: blue;
    /* comment
       comment */
    color: green;
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    ":root {
      color: red;
      color: blue;
      color: green;
    }"
  `);
});

test('omit blank declarations', () => {
  const style = styled.mixin`
    a: red;
    b: ${null};
    c: ${undefined};
    d: ${''};
    e: ${0};
    f: ${() => null};
    g: ${() => undefined};
    h: ${() => ''};
    i: ${() => 0};
    j: blue;
    k: null;
    l: undefined;
    m: false;
    n: true;
    o: ${false};
    p: ${true};
  `;

  expect(compiler.compile(':root', style())).toMatchInlineSnapshot(`
    ":root {
      a: red;
      e: 0;
      i: 0;
      j: blue;
      n: 1;
      p: 1;
    }"
  `);
});

test('auto-close declarations and blocks', () => {
  const style = `
    .foo {
      color: red;
      .bar {
        color: blue;
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    .foo .bar {
      color: blue;
    }"
  `);
});

test('extra commas and spaces', () => {
  const style = `
    .foo,, .bar {
      .baz  .boo {
        color: red;
      }
    }
  `;

  expect(compiler.compile(':root', style)).toMatchInlineSnapshot(`
    ".foo .baz .boo,
    .bar .baz .boo {
      color: red;
    }"
  `);
});

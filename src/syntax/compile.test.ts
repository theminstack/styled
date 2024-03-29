import { compile } from './compile.js';

describe('compile', () => {
  test('top level declarations', () => {
    const style = `
      color: red;
      margin: 1px;
    `;

    expect(compile(style)).toMatchInlineSnapshot(`
      {
        "children": [
          "color: red",
          "margin: 1px",
        ],
      }
    `);
  });

  test('quotes', () => {
    const style = `
      foo[bar="']"] {
        key: "value;notKey: notValue";
        key: 'value;notKey: notValue';
      }
      foo[bar='"]'] {
        declaration;
      }
    `;

    expect(compile(style)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "key: "value;notKey: notValue"",
              "key: 'value;notKey: notValue'",
            ],
            "condition": {
              "selectors": [
                "foo[bar="']"]",
              ],
            },
          },
          {
            "children": [
              "declaration",
            ],
            "condition": {
              "selectors": [
                "foo[bar='"]']",
              ],
            },
          },
        ],
      }
    `);
  });

  test('escapes', () => {
    expect(
      compile(`
        foo: bar\\;baz;
        foo: bar" \\";"baz
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [
          "foo: bar\\;baz",
          "foo: bar" \\";"baz",
        ],
      }
    `);
  });

  test('brackets', () => {
    expect(
      compile(`
        foo[;]: bar;
        foo(;): bar;
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [
          "foo[;]: bar",
          "foo(;): bar",
        ],
      }
    `);
  });

  test('parent selectors', () => {
    const style = `
      @media & {
        color: red;
      }
      & input {
        a & {
          cont&nt: "&";
        }
      }
    `;

    expect(compile(style)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "color: red",
            ],
            "condition": {
              "at": "@media &",
            },
          },
          {
            "children": [
              {
                "children": [
                  "cont&nt: "&"",
                ],
                "condition": {
                  "selectors": [
                    "a  & ",
                  ],
                },
              },
            ],
            "condition": {
              "selectors": [
                " &  input",
              ],
            },
          },
        ],
      }
    `);
  });

  test('omit empty blocks', () => {
    expect(
      compile(`
        .foo {
          
        }
        .bar {
          .baz {

          }
        }
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [],
      }
    `);
  });

  test('omit empty value declarations', () => {
    expect(
      compile(`
        foo:;
        bar: ;
        baz:  ;
        abc:
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [],
      }
    `);
  });

  test('ignore missing semicolon', () => {
    expect(
      compile(`
        .foo {
          bar: baz
        }
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "bar: baz",
            ],
            "condition": {
              "selectors": [
                ".foo",
              ],
            },
          },
        ],
      }
    `);
  });

  test('throw on unclosed quotes', () => {
    expect(() =>
      compile(`
        "foo: bar;
      `),
    ).toThrow();
  });

  test('throw on unclosed selector brackets', () => {
    expect(() =>
      compile(`
        .foo[bar {
          color: red;
        }
      `),
    ).toThrow();
  });

  test('ignore unclosed block brackets', () => {
    expect(
      compile(`
        .foo {
          color: red;
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "color: red",
            ],
            "condition": {
              "selectors": [
                ".foo",
              ],
            },
          },
        ],
      }
    `);
  });

  test('ignore extra block bracket', () => {
    expect(
      compile(`
        .foo {
          color: red;
        }
          color: blue;
        }
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "color: red",
            ],
            "condition": {
              "selectors": [
                ".foo",
              ],
            },
          },
          "color: blue",
        ],
      }
    `);
  });

  test('omit comments', () => {
    expect(
      compile(`
        color: black;
        /* foo
           bar */
        color: red;
        // baz
        color: blue;
      `),
    ).toMatchInlineSnapshot(`
      {
        "children": [
          "color: black",
          "color: red",
          "color: blue",
        ],
      }
    `);
  });
});

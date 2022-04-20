import { type StyleTemplateValues, createStyle } from './style';

const css = (template: TemplateStringsArray, ...values: StyleTemplateValues<{}, readonly []>) =>
  [template, values] as const;

test('static style', () => {
  const [template, values] = css`
    color: ${1};
    background: ${'2'};
  `;

  expect(createStyle(template, values).getString({})).toMatchInlineSnapshot(`
    "
        color: 1;
        background: 2;
      "
  `);
});

test('partially static style', () => {
  const [template, values] = css`
    color: ${1};
    background: ${() => '2'};
    margin: ${'3'};
    padding: ${() => 4};
  `;

  expect(createStyle(template, values).getString({})).toMatchInlineSnapshot(`
    "
        color: 1;
        background: 2;
        margin: 3;
        padding: 4;
      "
  `);
});

test('dynamic style', () => {
  const [template, values] = css`
    color: ${() => 1};
    background: ${() => '2'};
  `;

  expect(createStyle(template, values).getString({})).toMatchInlineSnapshot(`
    "
        color: 1;
        background: 2;
      "
  `);
});

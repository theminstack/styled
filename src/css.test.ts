import { css } from './css';

test('parametric css', () => {
  const helper = css<{ color?: string }>`
    color: ${(props) => props.color ?? 'black'};
  `;
  expect(helper({ color: 'red' }).trim()).toMatchInlineSnapshot(`"color: red;"`);
  expect(helper().trim()).toMatchInlineSnapshot(`"color: black;"`);
});

test('static css', () => {
  const str = css`
    color: ${'red'};
  `;
  expect(typeof str).toBe('string');
  expect(str).toMatchInlineSnapshot(`
    "
        color: red;
      "
  `);
});

test('auto-close partial statements', () => {
  expect(
    css`
      ${'color: red'}
    `,
  ).toMatchInlineSnapshot(`
    "
          color: red
        ;"
  `);
});

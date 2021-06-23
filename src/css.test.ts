import { css } from './css';

test('css', () => {
  const helper = css<{ color?: string }>`
    color: ${(props) => props.color ?? 'black'};
  `;
  expect(helper({ color: 'red' }).trim()).toMatchInlineSnapshot(`"color: red;"`);
  expect(helper().trim()).toMatchInlineSnapshot(`"color: black;"`);
});

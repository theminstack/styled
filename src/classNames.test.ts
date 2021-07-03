import { classNames } from './classNames';

test('makes a class names string', () => {
  expect(
    classNames('a', { b: true, c: false }, null, undefined, false, [
      'd',
      { e: true, f: false },
      null,
      undefined,
      false,
    ]),
  ).toMatchInlineSnapshot(`"a b d e"`);
});

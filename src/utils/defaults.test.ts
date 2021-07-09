import { defaults } from './defaults';

test('only replace undefined', () => {
  expect(defaults({ a: undefined, b: 'foo' }, { a: 'bar', b: undefined, c: undefined })).toEqual({
    a: 'bar',
    b: 'foo',
  });
});

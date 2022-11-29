import { createStyledComponent } from './component.js';

describe('createComponent', () => {
  test('displayName is component name with Base suffix removed', () => {
    const FooBase = () => null;
    const Foo = createStyledComponent(FooBase, [''], [], () => null, {});
    expect(Foo.displayName).toBe('Foo');
  });

  test('displayName is component displayName with Base suffix removed', () => {
    const A = () => null;
    A.displayName = 'FooBase';
    const Foo = createStyledComponent(A, [''], [], () => null, {});
    expect(Foo.displayName).toBe('Foo');
  });
});

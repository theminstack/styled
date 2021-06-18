# TSS

React visual primitives with first-class TypeScript support and a tiny footprint.

## Motivation

The [styled-components](https://styled-components.com/docs/basics#motivation) library is incredibly popular. The "visual primitives" (ie. atomic components with styles included as code) pattern combined with tagged templates, is both powerful and reasonably intuitive. However, it was created many years ago, well before TypeScript had gained the popularity it has now. Types have now been added by the community, but the API wasn't designed with types in mind, and some of the design choices are just not compatible with strong typing.

TSS implements the same patterns, and adds the following enhancements over the original styled-components library:

- First-class TypeScript support with a modified API for stronger types.
- Zero dependencies and a smaller bundle size.

### TSS vs styled-components

Most styled-components capabilities (basic and advanced) are supported, with some notable differences and omissions:

- The `styled.div` syntax is not supported (only `styled('div')`).
- The `attrs` method is replaced by the `use`, `set`, and `map` methods.
- The props type of styled components can be modified using the `props` method, instead of passing a generic parameter to the `styled` (or `styled.div`, etc.) methods.
- The [style object](https://styled-components.com/docs/advanced#style-objects) syntax is not supported.
- The [as](https://styled-components.com/docs/api#as-polymorphic-prop) polymorphic property is not supported, because automatically adding it makes correct typing nearly impossible.
- The attributes passed through to simple HTML elements (eg. `div`) are not [filtered based on known HTML attributes](https://styled-components.com/docs/basics#passed-props), and instead are filtered based on the following rules:
  - Primitive valued properties are passed through _unless_ the property names starts with `$`.
  - Function valued properties are passed through _only if_ the property name starts with `on`.
  - Object valued properties are passed through _only if_ the property name is `style`.
- No [theme](https://styled-components.com/docs/advanced#theming) is _automatically_ injected into styled components, because custom themes can be _manually_ injected by using a theme hook with the `use` method.
- No [keyframes](https://styled-components.com/docs/basics#animations) utility is included, because the `@keyframes` at-rule can be used in any styled template string, and the `getId` utility can be used if animation name collisions are a concern.
- No [createGlobalStyle](https://styled-components.com/docs/api#createglobalstyle) utility is included, because global styles can be created by calling `styled('style')` which produces a global style component.
- No automatic vendor prefixing is performed, because it drastically increases the library size and it's [unnecessary](http://shouldiprefix.com/) for most common styling scenarios.
- No tooling is required for testing, because when `process.env.NODE_ENV` is set to "test" (eg. during a Jest test) dynamic class names are stabilized and `<style>` elements are inlined.

The TSS API is also similar enough to the original API for the `vscode-styled-components` plugin to provide syntax support.

## Basic Examples

Create a custom theme (hook, provider, and type) with default values.

```tsx
export const [useTheme, ThemeProvider] = createTheme({
  colorInputBorder: 'black',
  colorInputBorderFocus: 'blue',
});

export type Theme = ReturnType<typeof useTheme>;
```

Create a styled text `<input>` element.

```tsx
// Uses the InferProps utility type to extend the intrinsic <input>
// element attributes.
export interface ITextInputProps extends InferProps<'input'> {
  // Adds new configuration properties.
  theme?: ThemeType;
  $size?: 'small' | 'large';
  // Narrows the allowed input types.
  type?: 'text' | 'password' | 'email' | 'date' | 'datetime-local' | 'month' | 'number';
}

export const TextInput = styled('input', 'TextInput')
  // Overrides the default input attributes with our custom styled
  // component props.
  .props<ITextInputProps>()
  // Provides default prop values.
  .use(() => ({
    theme: useTheme(),
    $size: 'small' as const,
    type: 'text' as const,
  }))`
    color: inherit;
    background: transparent;
    width: ${({ $size }) => ($size === 'small' ? '32rem' : '16rem')};
    border-width: 0 0 1px 0;
    border-color: ${({ theme }) => theme.colorInputBorder};
    &:focus {
      border-color: ${({ theme }) => theme.colorInputBorderFocus};
    }
  `;
```

Styled components can be re-styled as long as they still accept a `className` property.

```tsx
export const SignatureInput = styled(TextInput)`
  font-family: cursive;
`;
```

Styled components can be used as selectors template values, where they will resolve to a selector for the component's dynamically generated unique class.

```tsx
export const Form = styled('form')`
  ${TextInput}, ${SignatureInput} {
    margin: 1em;
  }
`;
```

Global styles are created by defining a styled `<style>` element. The generated component is a special case which injects a managed `<style>` element into the document `<head>`.

```tsx
export const GlobalStyle = styled('style')`
  html, body {
    padding: 0;
    margin: 0;
  }
`;
```

## Server Side Rendering (SSR)

No configuration is required to make SSR to work. When rendered without a browser context (ie. a `document` global), styles are rendered inline. On the client, TSS will pull the inlined styles into the document `<head>` _before_ React rehydration occurs.

For more advanced scenarios, you can implement the `IStyleManager` interface and use a `<StyledConfig serverManager={customManager}>...</StyledConfig>` wrapper to capture all rendered styles.

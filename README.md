# tsstyled

[![homepage](https://badgen.net/badge/https%3A%2F%2F/tsstyled.com?label=homepage)](https://tsstyled.com)
[![bundle size](https://badgen.net/bundlephobia/minzip/tsstyled@latest?label=size)](https://bundlephobia.com/result?p=tsstyled@latest)
[![github stars](https://badgen.net/github/stars/Shakeskeyboarde/tsstyled?icon=github)](https://github.com/Shakeskeyboarde/tsstyled)
[![npm version](https://badgen.net/npm/v/tsstyled?icon=npm&label=version)](https://www.npmjs.com/package/tsstyled)
[![build status](https://badgen.net/travis/Shakeskeyboarde/tsstyled?icon=travis&label=build)](https://www.travis-ci.com/github/Shakeskeyboarde/tsstyled)
[![coverage status](https://badgen.net/coveralls/c/github/Shakeskeyboarde/tsstyled/main)](https://coveralls.io/github/Shakeskeyboarde/tsstyled)

React visual primitives with first-class TypeScript support and a tiny footprint.

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Compatibility](#compatibility)
  - [Community](#community)
- [The Basics](#the-basics)
  - [Style HTML elements](#style-html-elements)
  - [Style React components](#style-react-components)
  - [Override props type](#override-props-type)
  - [Provide default prop values](#provide-default-prop-values)
  - [Add or update prop values](#add-or-update-prop-values)
  - [Map prop values](#map-prop-values)
  - [Global styles](#global-styles)
  - [Keyframes and fonts](#keyframes-and-fonts)
- [Theming](#theming)
  - [Create a theme](#create-a-theme)
  - [Use a theme](#use-a-theme)
  - [Override theme values](#override-theme-values)
- [Style syntax](#style-syntax)
  - [Simple CSS](#simple-css)
  - [Child selectors](#child-selectors)
  - [Nesting](#nesting)
  - [Parent selector references](#parent-selector-references)
  - [At-rules](#at-rules)
  - [Comments](#comments)
- [Style helpers](#style-helpers)
  - [Static helpers](#static-helpers)
  - [Parametric helpers](#parametric-helpers)
  - [Themed helpers](#themed-helpers)
- [Server Side Rendering (SSR)](#server-side-rendering-ssr)
- [Motivation](#motivation)
  - [The problem(s) with styled-components](#the-problems-with-styled-components)
  - [Moving from styled-components](#moving-from-styled-components)

## Getting Started

### Installation

Install the `tsstyled` package and its `react` peer dependency.

```sh
# With NPM
npm i tsstyled react

# With Yarn
yarn add tsstyled react
```

This library uses semantic versioning. Breaking changes will only be introduced in major version updates.

### Compatibility

- React >= 16.14.0
- TypeScript >= 4.2.4
- IE >= 11

### Community

Do you have questions, suggestions, or issues? Join the [Discord](https://discord.gg/r8u2rHrrGZ) server!

## The Basics

### Style HTML elements

Use string tag names to create simple HTML elements with styling. The styled component supports all of the same props (included refs) that the HTML element supports.

```tsx
import { styled } from 'tsstyled';

const StyledDiv = styled('div')`
  color: red;
`;
```

### Style React components

Any component which accepts a `className` prop can be styled, just like an HTML tag. The styled component supports all of the same props (including refs) that the base component supports.

```tsx
const Base = (props: { className?: string }): ReactElement => {
  return <div className={props.className}>Foo</div>;
};
const StyledBase = styled(Base)`
  color: red;
`;
```

### Override props type

The props type of a styled component can be replaced using the `props` method. If the new props type is not compatible (assignable) to the original props type, then you must provide a map function to convert the new props to those expected by the base component.

**NOTE**: The `props` method must always be the first styled method used. It is not available after using the `use`, `set`, or `map` methods.

```tsx
interface IStyledDivProps {
  description?: string;
}

const StyledDiv = styled('div').props<IStyledDivProps>((props) => ({
  // Pass the description to the base component as its only child.
  children: props.description,
}))`
  color: red;
`;
```

### Provide default prop values

Default prop values can be provided for undefined props with the `use` method. Props returned by the callback will only be set if the current prop value is undefined. This method is an alternative to using the `map` method with `Object.assign({}, defaultProps, props)` or `{ ...defaultProps, ...props }`, which allows explicitly undefined props to overwrite and hide default props.

```tsx
const StyledDiv = styled('div').use((props) => ({
  // Use the component ID as the default class name.
  className: props.id,
}))`
  color: red;
`;
```

### Add or update prop values

Prop values can be added and modified (but not removed or set to undefined) with the `set` method. Props returned by the callback will be set as long as the new value is defined. This method is an alternative to using the `map` method with `Object.assign({}, props, newProps)` or `{ ...props, ...newProps }`, which can allow explicitly undefined new prop values to overwrite and hide defined prop values.

```tsx
const StyledDiv = styled('div').set((props) => ({
  // Add a prefix to the existing class name.
  className: props.className && `prefix-${props.className}`,
}))`
  color: red;
`;
```

### Map prop values

Prop values can be completely rewritten using the `map` method. Props returned by the callback replace the current props without condition.

**NOTE**: Please give preference to the `use` and `set` methods. They provide better type support for their respective scenarios. Only use `map` when you need to _remove_ properties from the current props object.

```tsx
const StyledDiv = styled('div').set((props) => ({
  id: props.id,
  className: props.className,
  children: props.children,
  // Props that are not returned, are removed.
}))`
  color: red;
`;
```

### Global styles

A global stylesheet can be added by styling a `style` component.

```tsx
const GlobalStyle = styled('style')`
  body, html {
    margin: 0;
    padding: 0;
  }
`;

render(
  <>
    <GlobalStyle />
    <div>Page content</div>
  </>
);
```

### Keyframes and fonts

Defining keyframes or font-faces is the same as defining any other style. Since they are not scoped to any particular component, you may want to limit them to global styles, but they will work in any style. If you are concerned about names colliding, you can use the `getId` utility to generate unique names.

```tsx
import { styled, getId } from 'tsstyled';

const openSans = getId('Open Sans');
const slideIn = getId('slideIn');

const GlobalStyle = styled('style')`
  @font-face {
    font-family: ${openSans};
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
         url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
  }

  @keyframes ${slideIn} {
    from {
      transform: translateX(0%);
    }

    to {
      transform: translateX(100%);
    }
  }
`;

const StyledDiv = styled('div')`
  font-family: ${openSans};
  animation-name: ${slideIn};
`;
```

## Theming

Styled components created with `tsstyled` are not theme aware by default, and there is no default theme type or values. However, theming is trivial to setup, and requiring the extra setup makes it easier to support third party theme integration.

### Create a theme

Themes are just values made available via a React context, and preferably using a React hook. The `createTheme` utility is provided to make that a one step process. It accepts the default theme value, and returns a theme hook function and provider component.

```tsx
import { createTheme } from 'tsstyled';

const [useTheme, ThemeProvider] = createTheme({
  foregroundColor: black;
  backgroundColor: white;
});
```

### Use a theme

Themes can be integrated via React hooks in the `props`, `use`, `set`, or `map` method callbacks. Actually, any hook can be used in these callbacks (not just theme hooks) as long as hooks are not called conditionally. The recommended approach is to have hooks provide default values by calling them in a `use` method callback.

```tsx
const ThemedDiv = styled('div').use(() => ({
  theme: useTheme(),
}))`
  color: ${(props) => props.theme.foregroundColor};
  background: ${(props) => props.theme.backgroundColor};
`;
```

### Override theme values

The provider returned by the `createTheme` utility allows the theme to be overridden for part of your React tree. It's not necessary to use the provider unless you want to override theme values.

```tsx
const ThemeInvertedProvider = (props: { children?: ReactNode }) => {
  return (
    <ThemeProvider
      value={(current) => ({
        foregroundColor: current.backgroundColor,
        backgroundColor: current.foregroundColor,
      })}
    >
      {children}
    </ThemeProvider>
  );
};

render(
  <ThemeInvertedProvider>
    <ThemedDiv>Greetings from the dark side.</ThemedDiv>
  </ThemeInvertedProvider>
);
```

## Style syntax

Style syntax is CSS-like, and all CSS properties, selectors, and at-rules are supported. In addition, SCSS-like nesting is supported with parent selector references (`&`).

### Simple CSS

If you just want to style one element, use CSS properties at the top-level (no surrounding block).

```tsx
const StyledDiv = styled('div')`
  color: red;
`;
```

These CSS properties will be wrapped in a block with a selector for the styled dynamic class.

```css
._s7y13d {
  color: red;
}
```

### Child selectors

You can use CSS selectors and blocks to style children of the styled component.

```tsx
const StyledDiv = styled('div')`
  color: red;
  .child {
    color: blue;
  }
`
```

The styled dynamic class will be automatically prepended to all selectors to make them "scoped".

```css
._s7y13d {
  color: red;
}
._s7y13d .child {
  color: blue;
}
```

### Nesting

You can nest blocks to create more complex selectors.

```tsx
const StyledDiv = styled('div')`
  color: red;
  .child {
    color: blue;
    .grandchild {
      color: green;
    }
  }
`;
```

Just like the styled dynamic class is prepended to top-level selectors, so too are parent selectors prepended to child selectors.

```css
._s7y13d {
  color: red;
}
._s7y13d .child {
  color: blue;
}
._s7y13d .child .grandchild {
  color: green;
}
```

### Parent selector references

As noted above, the parent selector is automatically prepended to child selectors. This behavior can be _overridden_ by using a parent selector reference (`&`) to inject the parent selector _anywhere_ in your child selector. This includes injecting the parent selector multiple times to increase specificity, and is necessary when using pseudo selectors like `:hover` which you will probably want to apply directly to the styled component instead of to its children.

```tsx
const StyledDiv = styled('div')`
  && {
    color: red;
  }
  &:hover {
    color: blue;
  }
  .parent & {
    color: green;
  }
`
```

For any selector that contains an `&`, the parent selector will replace the `&` characters, and the parent selector will not be automatically prepended.

```css
._s7y13d._s7y13d {
  color: red;
}
._s7y13d:hover {
  color: blue;
}
.parent ._s7y13d {
  color green;
}
```

### At-rules

All CSS at-rules are supported (except `@charset` which isn't allowed inside `<style>` tags). Conditional group rules (ie. `@media` and `@supports`) which can have nested selector blocks, can themselves be nested, and can have deeply nested child selectors which use parent selector references.

```tsx
const StyledDiv = styled('div')`
  @media screen and (min-width: 900px) {
    color: red
  }
  .child {
    @media screen and (min-width: 600px) {
      .grandchild {
        color: blue;
        .adopted & {
          color: green;
        }
      }
    }
  }
`;
```

The at-rules will be hoisted as necessary, and parent selectors will be handled the same way they would be without the intervening at-rule.

```css
@media screen and (min-width: 900px) {
  ._s7y13d {
    color: red;
  }
}
@media screen and (min-width: 600px) {
  ._s7y13d .child .grandchild {
    color: blue;
  }
  .adopted ._s7y13d .child .grandchild {
    color: green;
  }
}
```

### Comments

Styles can contain both block (`/* */`) and line comments (`//`). Comments are never included in stylesheets.

```tsx
const StyledDiv = styled('div')`
  // This is a comment.
  /* And so is...
     this. */
`;
```

## Style helpers

Helpers are simply functions that return style strings. You could just make string builders the old fashioned way, but using the `css` utility enables syntax checking and highlighting.

### Static helpers

The `css` template function always returns a function, but it can still be used for simple static style string constants.

```tsx
import { css, styled } from 'tsstyled';

const font = css`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: 1rem;
`;

const StyledDiv = styled('div')`
  ${font}
  color: red;
`;
```

### Parametric helpers

If you're repeating styles with only some small differences, you can use a helper which accepts parameters.

```tsx
const font = css<{ scale?: number }>`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: ${(props) => props.scale ?? 1}rem;
`;

const StyledDiv = styled('div')`
  ${font(2)}
  color: red;
`;
```

### Themed helpers

If you're using theming, you'll almost certainly need some of your helpers to use the theme. This is just a specialized form of parametric helpers which accept the theme as a prop. However, it's a good idea _not_ to depend on the entire theme, only the values you need. This makes it easier to use the helper in the case where you don't have the theme, and just want to manually fill in the required theme values.

```tsx
const font = css<{ theme: Pick<Theme, 'fontSize'> }>`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize};
`;

const ThemedDiv = styled('div').use(() => ({ theme: useTheme() }))`
  ${font}
  color: red;
`;

// Or, if you can't use the theme for some reason.
const StyledDiv = styled('div')`
  ${font({ theme: { fontSize: '1rem' } })}
  color: red;
`;
```

## Server Side Rendering (SSR)

No configuration is required to make SSR work. When rendered without a browser context (ie. a `document` global), styles are rendered inline, before the first element that uses a style. On the client, `tsstyled` will pull the inlined styles into the document `<head>` _before_ React rehydration occurs.

If the default SSR support using inlined styles doesn't work for your scenario, you can use the `ServerStyleManager` and the `StyleConfig` component to capture styles rendered during SSR.

```tsx
import { ServerStyleManager, StyleConfig } from 'tsstyled';

const manager = new ServerStyleManager();
const html = renderToString(
  <StyleConfig serverManager={manager}>
    <App />
  </StyleConfig>
);
const styles = manager.getStyleTag();
```

The `getStyleTag` method returns an HTML string containing a _single_ `<style>` tag. There is also a `getStyleElement` method that returns the same style as a React element, and a `getStyleData` method that returns an array of raw style data (`{ key: string, cssText: string }`).

## Motivation

The [styled-components](https://styled-components.com/docs/basics#motivation) library is incredibly popular. The "visual primitives" pattern (ie. atomic components with styles included as code), combined with tagged templates, makes it powerful and an easy transition from CSS/SCSS.

However, it was created many years ago, well before TypeScript had gained the popularity it has now. Types have now been added by the community. But, the API wasn't designed with types in mind, and some of the design choices are just not compatible with strong typing.

This library is a refresh for Typescript and a better developer experience, with the key features intact.

### The problem(s) with styled-components

The styled-components types are usable... barely.

- Type errors are surfaced late, when you try to use the component, not when you using the `styled` function, `attrs` method, or the tagged template.
- It is possible to set the generics in ways that allow prop values to be assign without type errors, that will result in runtime errors.
- It is very easy to create a styled component with props that do nothing, which is confusing to developers. And, there’s a related problem where styling a component that does not accept a `className` will silently do nothing (no type error).
- The types are messy, hard to parse, and break some type utilities (`React.ComponentProps`)
- Setting generic types explicitly is hard to get right, because some orders of operation are reversed, and the type intersections are not the best solution for combining them.
- Theme typing is fragile, because it relies on declaration merging which doesn't always seem to work as intended. More importantly, using declaration merging locks all components into sharing a common theme type.
- See also the [DefinitlyTyped bugs for styled-components](https://github.com/DefinitelyTyped/DefinitelyTyped/issues?q=is%3Aissue+is%3Aopen+styled-components).

There is also a philosophical problem: The authors of styled-components chose to make re-styling so powerful, that it can invalidate assumptions made by the originally styled component.

The `as` property is allowed to change the base component to anything. This is lazy and incompatible with good design. If you want to implement your own component with an `as` property, that’s completely fine, _because you designed it that way._ But having it automatically added to every styled component opens up too many uncertainties, and paves the way for a fragile component hierarchy.

The order of applying `attrs` is reversed. This is the opposite of standard component design. In vanilla React, if you wrap a component with another component, the outer component now controls what reaches the inner component, _which is a good thing._ If you restyle (wrap) an already styled component, the restyle gets to reach around the inner styled component and apply properties directly to the base component. This is fragile because you are modifying internal behaviors that you don't have visibility on or control over.

All of this means that when styling a component, you can’t assume you’re styling the component you think you are, you don’t really know what props will be passed to you, and your props might not be passed to the base component.

### Moving from styled-components

Most styled-components capabilities (basic and advanced) are supported, with some notable differences and omissions:

- The `styled.div` syntax is not supported (only `styled('div')`).
- The `attrs` method is replaced by `props`, which can only be used once as the first chained method call after `styled`, and it is applied in the intuitive (ie. functional) order when restyling (instead of the [reverse order](https://styled-components.com/docs/basics#overriding-attrs) used by `attrs`).
- The template function returned by the `styled` function is not generic, because the `props` method is the only way to set the styled component's properties.
- The `use`, `set`, and `map` functions have been added to support stronger typing when manipulating property values, and they are also applied in the intuitive order like `props` (instead of the reverse order used by `attrs`).
- The [style object](https://styled-components.com/docs/advanced#style-objects) syntax is not supported, to keep the library size down, and because tagged templates provide a better developer experience overall.
- The [as](https://styled-components.com/docs/api#as-polymorphic-prop) polymorphic prop is not supported, because it does not fit the philosophy of this library.
- The attributes passed through to simple HTML elements (eg. `div`) are not [filtered based on known HTML attributes](https://styled-components.com/docs/basics#passed-props), but instead are filtered based on the following rules:
  1. Props that start with `$` are _always_ filtered out.
  2. The `style` and `children` props are _never_ filtered out.
  3. Function props are filtered out _unless_ the prop name starts with `on`.
  4. All other non-primitive (`string`, `number`, `boolean`) props are filtered out.
- The [component selector](https://styled-components.com/docs/advanced#referring-to-other-components) pattern only works when a component is given an _explicit_ display name, because making every component selectable adds transfer size to the SSR output, and requiring a name can mitigate some potential SSR vs client rendering order gotchas.
- No [theme](https://styled-components.com/docs/advanced#theming) is automatically injected into styled component props, because custom themes can be manually injected by using a theme hook with the `use` method.
- No [keyframes](https://styled-components.com/docs/basics#animations) utility is included, because the `@keyframes` at-rule can be used in any styled template string, and the `getId` utility can be used if animation name collisions are a concern.
- No [createGlobalStyle](https://styled-components.com/docs/api#createglobalstyle) utility is included, because global styles can be created by calling `styled('style')` which produces a global style component.
- No automatic vendor prefixing is performed, to keep library size and complexity down, and because it's [unnecessary](http://shouldiprefix.com/) for most common styling scenarios.

The `tsstyled` API is also similar enough to the original API for the `vscode-styled-components` plugin to provide syntax support.

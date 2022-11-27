# @minstack/styled

Minimal CSS-in-JS styled components solution for React.

- **Small**: ~2.8kB with zero dependencies.
- **Fast**: Similar in speed to other styled component solutions.
- **Simple**: Opinionated API creates a great developer experience.
- **Typed**: Written in Typescript. Designed for Typescript.

[![build](https://github.com/theminstack/styled/actions/workflows/build.yml/badge.svg)](https://github.com/theminstack/styled/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/theminstack/styled/branch/main/graph/badge.svg?token=Y9CEQA8D4O)](https://codecov.io/gh/theminstack/styled)

- [Goals](#goals)
- [Getting started](#getting-started)
- [Style properties](#style-properties)
- [Global styles](#global-styles)
  - [Defining keyframes and fonts](#defining-keyframes-and-fonts)
- [Theming](#theming)
- [Style syntax](#style-syntax)
  - [Styling self](#styling-self)
  - [Styling children](#styling-children)
  - [Component selectors](#component-selectors)
  - [Nesting rules](#nesting-rules)
  - [Using parent selector references](#using-parent-selector-references)
  - [Using at-rules](#using-at-rules)
  - [Using empty values](#using-empty-values)
  - [Commenting](#commenting)
- [Style helpers](#style-helpers)
- [Snapshot testing](#snapshot-testing)
- [Styled provider](#styled-provider)
  - [Server-side rendering (SSR)](#server-side-rendering-ssr)
  - [Nonce](#nonce)
- [Comparison](#comparison)
  - [Features](#features)
  - [Why not Goober?](#why-not-goober)
  - [Benchmarks](#benchmarks)
- [Release Notes](#release-notes)

## Goals

- Reasonably small bundle size
- Zero dependencies
- Strong type safety
- No declaration merging for theme typing
- Simple and opinionated API
- Full and future-proof CSS support
- Server side rendering
- Usable in libraries
- Compatible
  - React (Strict Mode) >= 16.14.0
  - ES2021 (eg. recent versions of Chrome, Edge, Safari, and Firefox)

There are also some things that are non-goals.

- No auto vendor prefixing
  - Rarely necessary.
- No object styles
  - Text styles are more portable and lint-able.
- No component polymorphism (eg. `as` property, `.withComponent()` method)
  - Breaks type-safety.
- No "non-style" features (eg. `.attrs()` method)
  - Use `defaultProps`.
- No React Native support
  - Costs outweigh benefits.

## Getting started

```tsx
import { styled } from '@minstack/styled';
```

Style any HTML element type by using the tag name. The styled component supports all of the same props (included refs, which are forwarded) that the HTML element supports.

```tsx
const StyledComponent = styled('div')`
  color: black;
`;
```

The tag name method style is also supported.

```tsx
const StyledComponent = styled.div`
  color: black;
`;
```

Style any React component which accepts a `className` property, or extend the styles of an already styled component.

```tsx
const StyledComponent = styled(Component)`
  color: black;
`;
```

## Style properties

Extra properties can be added to the styled component by setting the generic parameter of the template string. Generally, style properties should be prefixed with `$` to indicate that they are only used for styling. Any property name which starts with the `$` character will not be passed through to the underlying HTML element as an attribute.

```tsx
interface ComponentStyleProps {
  $font?: string;
}

const StyledComponent = styled('div')<ComponentStyleProps>`
  font-family: ${(props) => props.$font};
`;
```

## Global styles

Use the `styled.global` utility to create global style components.

```tsx
const GlobalStyle = styled.global`
  body,
  html {
    margin: 0;
    padding: 0;
  }
`;
```

Style properties can be added to global styles too.

```tsx
interface GlobalStyleProps {
  $font?: string;
}

const GlobalStyle = styled.global<GlobalStyleProps>`
  body,
  html {
    font-family: ${(props) => props.$font};
  }
`;
```

### Defining keyframes and fonts

Defining keyframes or font-faces is the same as defining any other style. Since they are not scoped to any particular component, they should probably only be used in global styles. To prevent name collisions, use the included `getId` utility to generate CSS-safe unique names.

```tsx
const openSansFont = getId('font/open-sans');
const slideInAnimation = getId('keyframes/slide-in');

const GlobalStyle = styled.global`
  @font-face {
    font-family: ${openSansFont};
    src: url('/fonts/OpenSans-Regular-webfont.woff') format('woff');
  }

  @keyframes ${slideInAnimation} {
    from {
      transform: translateX(0%);
    }

    to {
      transform: translateX(100%);
    }
  }
`;

const StyledComponent = styled('div')`
  font-family: ${openSansFont};
  animation-name: ${slideInAnimation};
`;
```

## Theming

Pass a theme hook (or any function) which returns a theme to the `createStyled` utility. The theme value will then be available as the second argument passed to any styled template string functional value.

```tsx
// File: styled-with-theme.ts
import { createStyled } from '@minstack/styled';

export const styled = createStyled(useTheme);
```

This creates a strongly typed `styled` instance. Use this instance instead of the built-in instance.

```tsx
import { styled } from './styled-with-theme';

const ThemedComponent = styled('div')`
  color: ${(props, theme) => theme.fgColor};
  background-color: ${(props, theme) => theme.bgColor};
`;
```

## Style syntax

All of CSS plus nesting is supported.

### Styling self

To apply styles directly to the HTML element or component being styled, use CSS properties at the top-level of the tagged template (no surrounding block).

```tsx
const StyledComponent = styled('div')`
  color: red;
`;
```

Top-level CSS properties will be wrapped in a dynamic styled class selector

```css
._rmsds7y13d_ {
  color: red;
}
```

### Styling children

Use CSS rule blocks to style children of the styled component.

```tsx
const StyledComponent = styled('div')`
  .child {
    color: blue;
  }
`;
```

The styled dynamic class will be automatically prepended to all selectors to make them "scoped".

```css
._rmsds7y13d_ .child {
  color: blue;
}
```

### Component selectors

Every styled component (except global styles) can be used as a selector.

```tsx
const StyledComponentA = styled('div')`
  color: blue;
`;

const StyledComponentB = styled('div')`
  ${StyledComponentA} {
    background-color: yellow;
  }
`;
```

Each styled component has a unique static class which is generated on creation. The styled component's `toString()` method returns a selector string (eg. `"._rmsss7y13d_"`) for that static class.

```css
._rmsds7y13d_ ._rmsss7y13d_ {
  color: red;
}
```

The static class is generated from the component's display name, the static part of the style template, inherited static classes (when extending another styled component), and the number of previously created components that share the same "thumbprint". In most cases, this should make static classes stable across SSR and client renders. If static class SSR problems occur, it's probably due to an unstable creation order and components with the same fingerprint. Try changing the `displayName` using the `.withConfig()` method to make the problematic component's fingerprint unique.

```tsx
const StyledComponent = styled.div.withConfig({ displayName: 'StyledComponent' })`
  color: red;
`;
```

### Nesting rules

Nest rule blocks to create more complex selectors.

```tsx
const StyledComponent = styled('div')`
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
._rmsds7y13d_ .child {
  color: blue;
}
._rmsds7y13d_ .child .grandchild {
  color: green;
}
```

### Using parent selector references

Parent selector references (`&`) work the same way they do in SCSS/SASS. The one extra detail is that when a parent selector is used at the style root (not nested inside a parent block), it refers to the unique style class of the current style, which is the implicit/virtual parent block selector for the style.

```tsx
const StyledComponent = styled('div')`
  && {
    color: red;
  }
  &:hover {
    color: blue;
  }
  .parent & {
    color: green;
  }
`;
```

### Using at-rules

All CSS at-rules are supported (except `@charset` which isn't allowed inside `<style>` elements).

```tsx
const StyledComponent = styled('div')`
  @media screen and (min-width: 900px) {
    color: red;
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

At-rules will be hoisted as necessary, and parent selectors will be handled the same way they would be without the intervening at-rule.

```css
@media screen and (min-width: 900px) {
  ._rmsds7y13d_ {
    color: red;
  }
}
@media screen and (min-width: 600px) {
  ._rmsds7y13d_ .child .grandchild {
    color: blue;
  }
  .adopted ._rmsds7y13d_ .child .grandchild {
    color: green;
  }
}
```

### Using empty values

If a CSS property value is "empty" (empty string, `false`, `null`, `undefined`, or `""`), then the whole property will be omitted from the style.

```tsx
const StyledComponent = styled('div')`
  color: ${null};
  background-color: red;
`;
```

The color property is not included because it has no value.

```css
._rmsds7y13d_ {
  background-color: red;
}
```

### Commenting

Styles can contain both block (`/* */`) and line comments (`//`). Comments are never included in rendered stylesheets.

```tsx
const StyledComponent = styled('div')`
  // This is a comment.
  /* And so...
     ...is this. */
`;
```

## Style helpers

The `styled.string` tagged template function returns a simple style string with all values interpolated. Only static values are allowed (no functions). Empty property values (`null`, `undefined`, and `false`) work the same way they do in styled components, and cause the property to be omitted.

```tsx
const fontHelper = styled.string`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: ${size};
`;

// Then use in a styled component or another helper.
const StyledComponent = styled('div')`
  ${fontHelper}
  color: red;
`;
```

The `styled.string` helper has no side effects and does very little work, so it's also safe to use in functions.

```tsx
const shadow = (depth: number) => {
  return styled.string`
    -moz-box-shadow: 0 ${depth}px ${depth}px black;
    -webkit-box-shadow: 0 ${depth}px ${depth}px black;
    box-shadow: 0 ${depth}px ${depth}px black;
  `;
};

// Then use in a styled component or another helper.
const StyledComponent = styled('div')<{ $shadowDepth: number }>`
  ${(props) => shadow(props.$shadowDepth)}
  color: red;
`;
```

## Snapshot testing

Use the `StyledTest` wrapper to produce snapshots with stable class names and style information.

```tsx
const container = render(<MyStyledComponent />, { wrapper: StyledTest });

expect(container).toMatchSnapshot();
```

```
// Snapshot
<div>
  <div
    class="_test-dynamic-0_ _test-static-0_"
  >
    Hello, world!
  </div>
  <style>

    ._test-dynamic-0_ {
      padding: 1rem;
    }

  </style>
</div>
```

## Styled provider

A `StyledProvider` can override the default `cache`, `manager`, and `renderer`. _No provider is required for default operation._

- **Styled Cache:** Compiles style strings to CSS text and dynamic class names.
- **Styled Manager:** Renders style sheets.
- **Styled Renderer:** Renders a components after style classes have been added to their properties.

```tsx
const cache = createStyledCache();
const manager = createStyledManager();
const renderer = createStyledRenderer();

render(
  <StyledProvider cache={cache} manager={manager} renderer={renderer}>
    <App />
  </StyledProvider>,
);
```

The `StyledTest` component is actually a `StyledProvider` which injects test versions of all three resources to replace class names and capture styles.

**Note:** The provided cache, manager, and renderer must not change over the lifetime of a styled component. An error will be thrown (or logged in production) if they mutate.

### Server-side rendering (SSR)

Use `createSsrStyledManager` and the `StyledProvider` to capture styles when rendering the application on the server.

```tsx
const manager = createSsrStyledManager();
const html = renderToString(
  <StyledProvider manager={manager}>
    <App />
  </StyledProvider>,
);

const html = `
<!doctype HTML>
<html>
  <head>
    ${manager.getStyleTags()}
  </head>
  <body>
    <div id="root">
      ${html}
    </div>
  </body>
</html>
`;
```

The SSR manager's `getStyleTags()` method returns a single html string containing only `<style>` tags. There are also `getStyleElement()` (React elements array) and `getCss()` (css strings array) methods.

### Nonce

Use `createStyledManager` (or `createSsrStyledManager`) and the `StyledProvider` to set a `nonce` on all injected styles.

```tsx
const manager = createStyledManager(nonce);

render(
  <StyledProvider manager={manager}>
    <App />
  </StyledProvider>,
);
```

## Comparison

React Micro-Styled compared to other styled component solutions.

### Features

- 🟢 Supported
- 🟡 Partially supported
- 🔴 Not supported
- ⭕ Not documented

|             | Feature                        | React Micro-Styled | Goober | Styled Components | Emotion |
| ----------- | ------------------------------ | ------------------ | ------ | ----------------- | ------- |
| **Library** |                                |                    |        |                   |         |
|             | Bundle size (approx. kB)[1]    | 2.8                | 1.2    | 13.3              | 9.1     |
|             | Zero dependencies              | 🟢                 | 🟢     | 🔴                | 🔴      |
|             | Typescript native              | 🟢                 | 🟢     | 🔴                | 🟢      |
| **API**     |                                |                    |        |                   |         |
|             | Tagged template styles         | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Dynamic styles                 | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Object styles                  | 🔴                 | 🟢     | 🟢                | 🟢      |
|             | Global styles                  | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Polymorphism (`as`)            | 🔴                 | 🟢     | 🟢                | 🟢      |
|             | Property mapping (`attrs`)     | 🔴                 | 🔴     | 🟢                | 🔴      |
|             | Theming [2]                    | 🟢                 | 🟡     | 🟡                | 🟡      |
|             | SSR                            | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Snapshot testing               | 🟢                 | 🔴     | 🟢                | 🟢      |
| **Style**   |                                |                    |        |                   |         |
|             | Basic CSS syntax [3]           | 🟢                 | 🟡     | 🟢                | 🟢      |
|             | CSS `@media`                   | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | CSS `@keyframes`               | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | CSS `@font-face`               | 🟢                 | ⭕     | ⭕                | 🟢      |
|             | CSS `@import`                  | 🟢                 | ⭕     | 🔴                | 🟢      |
|             | Other CSS `@` rules            | 🟢                 | ⭕     | ⭕                | ⭕      |
|             | Vendor prefixing [4]           | 🔴                 | 🟡     | 🟢                | 🟢      |
|             | Rule nesting                   | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Parent selectors (`&`)         | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Styled component selectors [5] | 🟢                 | 🟡     | 🟢                | 🟢      |

&nbsp;

- [1] Bundle size is of the `styled` export (after tree-shaking, minification, and gzip) calculated using the Webpack bundle analyzer.
- [2] Goober, Styled Components, and Emotion, all support only a single theme, which must be typed using declaration merging.
- [3] Goober's tagged template compiler will incorrectly parse CSS in some (rare) cases.
- [4] Goober provides vendor prefixing as an additional package.
- [5] Goober's component selectors are not always unique per component.

### Why not Goober?

Goober is very similar to this solution. It's just as fast, smaller, and has support for a few extra feature (object styles, and the `as` property). So what are Goober's downsides, and why would I use this instead?

- Goober's tagged template compiler uses regular expressions to match some sequences in a way that is not foolproof. This is likely not a difference that will be noticeable except in some very specific cases where escape sequences, quotes, and brackets are used. But, it cannot be said to fully support all CSS syntax. This library uses a real tokenizer/parser (no regular expressions) to correctly match escapes, quotes, and brackets in all cases. This compiler works in O(n) time and is just as fast, if not faster. This compiler (and more readable/maintainable code) account for most of the difference in size between the libraries.
- Goober does not provide a way to stabilize class names and render styles for snapshot testing. This library provides the `StyledTest` wrapper component which not only enables snapshot testing, but does it in a way that is test framework agnostic.
- Goober's "component selectors" use the dynamic class generated from the component style, which is the cause of several open bugs. This library uses a separate static class, generated when the styled component is defined, based on the component's display name and static classes inherited from extending other styled components.
- Goober uses a `setup()` function which configures the _single global instance of the API_, and this does not change the theme type. Extending the theme type can be accomplished with declaration merging, but this is again global and not very type safe. This library provides the `createStyled()` factory that _returns a new API instance_, which has a strongly typed theme.
- Goober injects the theme into component props which could collide with an existing theme property. This library passes the theme to template function values as a second argument.
- Goober requires a Babel plugin to enable the tag name method syntax (ie. `styled.div` instead of `styled('div')`). This library supports `styled.<tag>` without compile time support.
- Goober targets Preact as its primary JSX framework, requiring a call to `setup()` when using React. This library targets React and requires `preact/compat` when using Preact.

This library is opinionated and leaves out some features that Goober supports. This is to reduce the number of alternative ways that styled components can be designed, which increases code consistency, and provides an overall better developer experience (DX). Removing support for two different ways to accomplish the same thing also means the library size and runtime overhead are reduced and/or allocated to improved core features, and that the library is more maintainable overall.

- Goober supports object styles. This library exclusively uses tagged templates because...
  - They can be copied more easily than objects, including to and from CSS/LESS text files.
  - They provide better intellisense, completion, highlighting, and linting when using VS Code (with the styled-components extension).
  - They are more readable, less verbose, and require fewer escapes.
  - They provide better support for duplicate CSS declarations (the same CSS property name with different values), which allows for values which may still require vendor prefixing.
- Goober supports the `as` property for changing the underlying component type of the styled component. This library does not because it is inherently type unsafe, and using style helpers (eg. the `styled.string` utility) provides a better way to reuse styles.

### Benchmarks

See the [benchmark.js](benchmark.js) script for the benchmark implementation.

| Library            | Op/s    |
| ------------------ | ------- |
| React Micro-Styled | 144,970 |
| Goober             | 142,028 |
| Emotion            | 124,681 |
| Styled Components  | 118,072 |

## Release Notes

- v1.0.0
  - Renamed to @minstack/styled
- react-micro-styled
  - v2.0.7
    - Internal compiler speed/size improvements
  - v2.0.6
    - Readme update
  - v2.0.5
    - Readme update
    - Improved static class stability
  - v2.0.4
    - `getId` accepts an optional namespace argument (re-added)
    - Added `.withConfig()` static method to styled templates
    - Use major version in `getId` and dynamic class hashes
    - Component static class generation is namespaced by display name and inherited static classes
  - v2.0.3
    - Readme update
  - v2.0.2
    - Readme update
    - Nonce support
  - v2.0.1
    - Readme update
  - v2.0.0
    - New Features
      - Faster and more reliable style compiler
      - Tag name method support (eg. `styled.div` alternative to `styled('div')`)
      - Using React's `useInsertionEffect` when available
      - Added `styled.string` helper for building static style strings
      - Added `StyledProvider`
        - Improved SSR support (`createSsrStyledManager`)
        - Improved snapshot testing support (`StyledTest`)
    - Breaking Changes
      - `getId` no longer accepts an argument
      - Supported ECMA version changed to ES2021
      - Removed `styled.mixin`
      - Removed `renderStylesToString`

# React Micro-Styled

A small, fast, and simple CSS-in-JS styled components solution for React, written in Typescript.

- **Small**: ~3.1kB (minified and gzipped) with zero dependencies.
- **Fast**: Similar in speed to other styled component solutions.
- **Simple**: Minimal/Opinionated API creates a great developer experience.
- **Typed**: Written in Typescript. Designed for Typescript.

[![build](https://github.com/Shakeskeyboarde/react-micro-styled/actions/workflows/build.yml/badge.svg)](https://github.com/Shakeskeyboarde/react-micro-styled/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/Shakeskeyboarde/react-micro-styled/branch/main/graph/badge.svg?token=Y9CEQA8D4O)](https://codecov.io/gh/Shakeskeyboarde/react-micro-styled)

- [Goals](#goals)
- [Getting started](#getting-started)
- [Style properties](#style-properties)
- [Global styles](#global-styles)
  - [Defining keyframes and fonts](#defining-keyframes-and-fonts)
- [Theming](#theming)
- [Style syntax](#style-syntax)
  - [Styling self](#styling-self)
  - [Styling children](#styling-children)
  - [Selecting styled components](#selecting-styled-components)
  - [Nesting rules](#nesting-rules)
  - [Using parent selector references](#using-parent-selector-references)
  - [Using at-rules](#using-at-rules)
  - [Using empty values](#using-empty-values)
  - [Commenting](#commenting)
- [Style helpers](#style-helpers)
- [Snapshot testing](#snapshot-testing)
- [Styled provider](#styled-provider)
  - [Server-side rendering (SSR)](#server-side-rendering-ssr)
- [Comparison](#comparison)
  - [Features](#features)
  - [Benchmarks](#benchmarks)
- [Release Notes](#release-notes)

## Goals

- Small bundle size and zero dependencies
- Simple and opinionated API, with high quality types.
- Type-safe themes without declaration merging
- Future-proof CSS support
- Server side rendering
- Compatibility
  - React (Strict Mode) >= 16.14.0
  - ES2021 (eg. recent versions of Chrome, Edge, Safari, and Firefox)
  - Webpack tree-shakable

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
import { styled } from 'react-micro-styled';
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
const openSansFont = getId();
const slideInAnimation = getId();

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
import { createStyled } from 'react-micro-styled';

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

Style syntax is CSS-like, and all CSS properties, selectors, and at-rules are supported. In addition, SCSS-like nesting is supported with parent selector references (`&`).

### Styling self

To apply styles directly to the HTML element or component being styled, use CSS properties at the top-level of the tagged template (no surrounding block).

```tsx
const StyledComponent = styled('div')`
  color: red;
`;
```

Top-level CSS properties will be wrapped in a dynamic styled class selector

```css
._rmsds7y13d {
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
._rmsds7y13d .child {
  color: blue;
}
```

### Selecting styled components

Every styled component (except global styles) can be used as a selector for that specific styled component.

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

The styled component's `toString()` method returns a unique selector string (eg. `"._rmsss7y13d_"`) which matches that specific styled component.

```css
._rmsds7y13d ._rmsss7y13d_ {
  color: red;
}
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
._rmsds7y13d .child {
  color: blue;
}
._rmsds7y13d .child .grandchild {
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
  ._rmsds7y13d {
    color: red;
  }
}
@media screen and (min-width: 600px) {
  ._rmsds7y13d .child .grandchild {
    color: blue;
  }
  .adopted ._rmsds7y13d .child .grandchild {
    color: green;
  }
}
```

### Using empty values

If a CSS property value is "empty" (empty string, `false`, `null` or `undefined`), then the whole property will be omitted from the style.

```tsx
const StyledComponent = styled('div')`
  color: ${null};
  background-color: red;
`;
```

The color property is not included because it has no value.

```css
._rmsds7y13d {
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
    class="_test0_ _test1_"
  >
    Hello, world!
  </div>
  <style>

    ._test0_ {
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

## Comparison

React Micro-Styled compared to other styled component solutions.

### Features

- 🟢 Supported
- 🟡 Partially supported
- 🔴 Not supported
- ⭕ Not documented

|             | Feature                    | React Micro-Styled | Goober | Styled Components | Emotion |
| ----------- | -------------------------- | ------------------ | ------ | ----------------- | ------- |
| **Library** |                            |                    |        |                   |         |
|             | Bundle size (approx. kB)   | 3.1                | 1.3    | 12.7              | 11.2    |
|             | Zero dependencies          | 🟢                 | 🟢     | 🔴                | 🔴      |
|             | Typescript native          | 🟢                 | 🟢     | 🔴                | 🟢      |
| **API**     |                            |                    |        |                   |         |
|             | Tagged template styles     | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Dynamic styles             | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Object styles              | 🔴                 | 🟢     | 🟢                | 🟢      |
|             | Global styles              | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Polymorphism (`as`)        | 🔴                 | 🟢     | 🟢                | 🟢      |
|             | Property mapping (`attrs`) | 🔴                 | 🔴     | 🟢                | 🔴      |
|             | Theming [1]                | 🟢                 | 🟡     | 🟡                | 🟡      |
|             | SSR                        | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Snapshot testing           | 🟢                 | 🔴     | 🟢                | 🟢      |
| **Style**   |                            |                    |        |                   |         |
|             | CSS `@media`               | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | CSS `@keyframes`           | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | CSS `@font-face`           | 🟢                 | ⭕     | ⭕                | 🟢      |
|             | CSS `@import`              | 🟢                 | ⭕     | 🔴                | 🟢      |
|             | Other CSS `@` rules        | 🟢                 | ⭕     | ⭕                | ⭕      |
|             | Vendor prefixing [2]       | 🔴                 | 🟡     | 🟢                | 🟢      |
|             | Rule nesting               | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Parent selectors (`&`)     | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Styled component selectors | 🟢                 | 🟢     | 🟢                | 🟢      |

&nbsp;

- [1] Goober, Styled Components, and Emotion, all support only a single theme, which must be typed using declaration merging.
- [2] Goober provides vendor prefixing as an additional package.

Goober's style compiler is not very robust. It does not do bracket matching for instance. Instead, it relies on simple regular expressions to compile style strings to CSS. Goober has made shrinking the library size their highest priority, at the expense of the design.

Conversely, styled-components and Emotion use compilers that are over-engineered for CSS-in-JS, which is necessary to support Stylis for vendor prefixing.

React Micro-Styled uses a fast 0(n) compiler that does not compromise on correctness. Any valid style _will_ be correctly compiled to CSS.

### Benchmarks

See the [perf.js](perf.js) script for the benchmark implementation.

| Library            | Op/s    |
| ------------------ | ------- |
| React Micro-Styled | 144,970 |
| Goober             | 142,028 |
| Emotion            | 124,681 |
| Styled Components  | 118,072 |

## Release Notes

- v2.0.0
  - New Features
    - Faster and more reliable style compiler
    - Tag name method support (eg. `styled.div` alternative to `styled('div')`)
    - Using React's `useLayoutEffect` when available
    - Added `styled.string` helper for building static style strings
    - Added `StyledProvider`
      - Improved SSR support (`createSsrStyledManager`)
      - Improved snapshot testing support (`StyledTest`)
  - Breaking Changes
    - `getId` no longer accepts an argument
    - Supported ECMA version changed to ES2021
    - Removed `styled.mixin`
    - Removed `renderStylesToString`

# React Micro-Styled

A small, fast, and simple CSS-in-JS styled components solution for React, written in Typescript.

- **Small**: Less than 4kb (minified and gzipped) and zero dependencies.
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
- [Server-side rendering (SSR)](#server-side-rendering-ssr)
- [Comparison](#comparison)

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
- No object styles
- No component polymorphism (eg. `as` property, `withComponent` method)
- No "non-style" features (eg. `.attrs()` method)
- No React Native support

## Getting started

```tsx
import { styled } from 'react-micro-styled';
```

Style any HTML element type by using the tag name. The styled component supports all of the same props (included refs, which are forwarded) that the HTML element supports. Styling basic HTML elements is what you should be doing most of the time.

```tsx
const StyledComponent = styled('div')`
  color: black;
`;
```

Style any React component which accepts a `className` property.

```tsx
const StyledComponent = styled(Component)`
  color: black;
`;
```

Extend the styling of an already styled component.

```tsx
const ReStyledComponent = styled(StyledComponent)`
  color: gray;
`;
```

## Style properties

You can add extra properties to the styled component by setting the generic parameter of the template string. Generally, you should prefix style properties with `$` to indicate that they are only used for styling. Any property name which starts with the `$` character will not be passed through to the underlying HTML element as an attribute.

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

You can add style properties to global styles too.

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
const openSansFont = getId('Open Sans');
const slideInAnimation = getId('slideIn');

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
._rms_abcdef {
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
._rms_abcdef .child {
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

The styled component's `toString()` method returns a unique selector string (eg. `"._rmsid_abcdef"`) which matches that specific styled component.

```css
._rms_abcdef ._rmsid_abcdef {
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
._rms_abcdef .child {
  color: blue;
}
._rms_abcdef .child .grandchild {
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
  ._rms_abcdef {
    color: red;
  }
}
@media screen and (min-width: 600px) {
  ._rms_abcdef .child .grandchild {
    color: blue;
  }
  .adopted ._rms_abcdef .child .grandchild {
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
._rms_abcdef {
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

## Server-side rendering (SSR)

Use the `ssr` utility to render both the html and styles.

```tsx
const [rendered, styles] = ssr(() => renderToString(<App />));

const html = `
<!doctype HTML>
<html>
  <head>
    ${styles}
  </head>
  <body>
    <div id="root">
      ${rendered}
    </div>
  </body>
</html>
`;
```

**Note:** SSR will not work in a browser (if `document` is defined).

## Comparison

React Micro-Styled compared to other styled component solutions.

- 🟢 Supported
- 🟡 Partially supported
- 🔴 Not supported
- ⭕ Not documented

|             | Feature                    | React Micro-Styled | Goober | Styled Components | Emotion |
| ----------- | -------------------------- | ------------------ | ------ | ----------------- | ------- |
| **Library** |                            |                    |        |                   |         |
|             | Bundle size (approx. kB)   | 2.7                | 1.3    | 12.7              | 11.2    |
|             | Zero dependencies          | 🟢                 | 🟢     | 🔴                | 🔴      |
|             | Typescript native          | 🟢                 | 🟢     | 🔴                | 🟢      |
| **API**     |                            |                    |        |                   |         |
|             | Tagged template styles     | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Object styles              | 🔴                 | 🟢     | 🟢                | 🟢      |
|             | Global styles              | 🟢                 | 🟢     | 🟢                | 🟢      |
|             | Polymorphism (`as`)        | 🔴                 | 🟢     | 🟢                | 🟢      |
|             | Property mapping (`attrs`) | 🔴                 | 🔴     | 🟢                | 🔴      |
|             | Theming [1]                | 🟢                 | 🟡     | 🟡                | 🟡      |
|             | SSR                        | 🟢                 | 🟢     | 🟢                | 🟢      |
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

Goober's style compiler is not very robust. It does not do bracket matching for instance. Instead, it relies on simple regular expressions to compile style strings to CSS.

Conversely, styled-components and Emotion use compilers that are over-engineered for CSS-in-JS, which is necessary to support Stylis for vendor prefixing.

React Micro-Styled uses a fast 0(n) compiler that does not compromise on correctness. Any valid style _will_ be correctly compiled to CSS.

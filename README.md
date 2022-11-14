# React Micro-Styled

A small, fast, and simple CSS-in-JS styled components solution for React, written in Typescript.

- **Small**: Less than 4kb (minified and gzipped) and zero dependencies.
- **Fast**: Similar to other styled component solutions.
- **Simple**: Minimal/Opinionated API creates a great developer experience.
- **Typed**: Written in Typescript. Designed for Typescript.

[![build](https://github.com/Shakeskeyboarde/react-micro-styled/actions/workflows/build.yml/badge.svg)](https://github.com/Shakeskeyboarde/react-micro-styled/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/Shakeskeyboarde/react-micro-styled/branch/main/graph/badge.svg?token=Y9CEQA8D4O)](https://codecov.io/gh/Shakeskeyboarde/react-micro-styled)

---

- [Goals](#goals)
- [Getting Started](#getting-started)
- [Style properties](#style-properties)
- [Global styles](#global-styles)
  - [Defining keyframes and fonts](#defining-keyframes-and-fonts)
- [Theming](#theming)
- [Style syntax](#style-syntax)
  - [Styling self](#styling-self)
  - [Styling children](#styling-children)
  - [Styling other styled components](#styling-other-styled-components)
  - [Nesting rules](#nesting-rules)
  - [Using parent selector references](#using-parent-selector-references)
  - [Using at-rules](#using-at-rules)
  - [Using empty values](#using-empty-values)
  - [Commenting](#commenting)
- [Style mixins (helpers)](#style-mixins-helpers)
  - [Creating simple mixins](#creating-simple-mixins)
  - [Creating parametric mixins](#creating-parametric-mixins)
- [Server Side Rendering (SSR)](#server-side-rendering-ssr)
- [Testing](#testing)
- [Comparison](#comparison)
  - [Benchmarks](#benchmarks)

---

## Goals

- Small bundle size and zero dependencies
- Simple and opinionated API, with high quality types.
- Type-safe themes without declaration merging
- Future-proof CSS support
- Server side rendering
- Compatibility
  - React >= 16.14.0
  - ES2017/ES8 (eg. recent versions of Chrome, Edge, Safari, and Firefox)
  - Webpack tree-shakable

There are also some things that are non-goals. They were considered, and then the choice was made to explicitly not include support for them.

- No auto vendor prefixing
- No object styles
- No component polymorphism (eg. `as` property, `withComponent` method)
- No "non-style" features (eg. `.attrs()` method)
- No React Native support

## Getting Started

```tsx
import { styled } from 'react-micro-styled';
```

Style any HTML element type by using the tag name. The styled component supports all of the same props (included refs, which are forwarded) that the HTML element supports. Styling basic HTML elements is what you should be doing most of the time.

```tsx
const StyledComponent = styled('div')`
  color: black;
`;
```

Style any React component which accepts a `className` property. This comes with more tech debt than styling HTML elements, because you can't be sure how the style class is being applied inside the component. This should be done rarely and with careful consideration.

```tsx
const StyledComponent = styled(Component)`
  color: black;
`;
```

Extend the styling of an already styled component. Just like you want to keep your CSS specificity as low as possible, you also want to avoid trying to "patch" an already styled component. Styles can be dynamic, which means applying overrides can quickly get complicated. This should be an absolute last resort.

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
._s7y13d {
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
._s7y13d .child {
  color: blue;
}
```

### Styling other styled components

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

The styled component's `toString()` method returns a unique selector string (eg. `".tss_s7y13d"`) which matches that specific styled component.

```css
._s7y13d .tss_s7y13d {
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
._s7y13d .child {
  color: blue;
}
._s7y13d .child .grandchild {
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
._s7y13d {
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

## Style mixins (helpers)

The `styled.mixin` tagged template utility returns a mixin (AKA: helper) function. When the returned function is called, it returns a style string with all values interpolated.

### Creating simple mixins

Mixins do not accept any parameters by default.

```tsx
const fontMixin = styled.mixin`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: 1rem;
`;

const StyledComponent = styled('div')`
  color: red;
  ${fontMixin}
`;
```

### Creating parametric mixins

Helpers which accept parameters can be created by setting the generic parameter of the `styled.mixin` template string.

```tsx
interface FontMixinProps {
  scale?: number;
}

const fontMixin = styled.mixin<FontMixinProps>`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: ${(props) => props.scale || 1}rem;
`;

const StyledComponent = styled('div')`
  ${fontMixin({ scale: 2 })}
  color: red;
`;
```

## Server Side Rendering (SSR)

SSR rendering is detected when there is no `document` global, and styles that would have been added to the DOM are recorded instead. After rendering the document body, use the `renderStylesToString` utility to get all of the `<style>` elements as an HTML string.

```tsx
const appHtml = renderToString(<App />);
const stylesHtml = renderStylesToString();
const html = `
<!doctype HTML>
<html>
<head>
  ${stylesHtml}
</head>
<body>
  <div id="root">${appHtml}</div>
</body>
</html>
`;
```

## Testing

During testing, there may be a DOM (eg. jsdom) and a `document` global. However, the `NODE_ENV` environment variable should also be set to `test` (Jest sets this automatically). If it is, the SSR implementation is used. So, you can use the same `renderStylesToString` utility to test (eg. Jest snapshots) your styles.

```tsx
expect(renderStylesToString()).toMatchSnapshot();
```

## Comparison

React Micro-Styled compared to other styled component solutions.

- 🟢 Supported
- 🟡 Partially supported
- 🔴 Not supported
- ⭕ Not documented

|             | Feature                    | React Micro-Styled | Goober | Styled Components | Emotion |
| ----------- | -------------------------- | ------------------ | ------ | ----------------- | ------- |
| **Library** |                            |                    |        |                   |         |
|             | Bundle size (approx. kB)   | 4                  | 2      | 13                | 8       |
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
|             | Style mixins [3]           | 🟢                 | 🟡     | 🟢                | 🟢      |
|             | Styled component selectors | 🟢                 | 🟢     | 🟢                | 🟢      |

&nbsp;

- [1] Goober, Styled Components, and Emotion, all support only a single theme, which must be typed using declaration merging.
- [2] Goober provides vendor prefixing as an additional package.
- [3] Goober doesn't provide a `css` utility for creating mixins, but it does support function values in tagged templates.

### Benchmarks

The benchmark app is available by cloning the [repository](https://github.com/Shakeskeyboarde/react-micro-styled) and running the `npm start` command.

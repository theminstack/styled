[![homepage](https://badgen.net/badge/https%3A%2F%2F/tsstyled.com?label=homepage)](https://tsstyled.com)
[![bundle size](https://badgen.net/bundlephobia/minzip/tsstyled@latest?label=size)](https://bundlephobia.com/result?p=tsstyled@latest)
[![github stars](https://badgen.net/github/stars/Shakeskeyboarde/tsstyled?icon=github)](https://github.com/Shakeskeyboarde/tsstyled)
[![npm version](https://badgen.net/npm/v/tsstyled?icon=npm&label=version)](https://www.npmjs.com/package/tsstyled)
[![build status](https://badgen.net/travis/Shakeskeyboarde/tsstyled?icon=travis&label=build)](https://www.travis-ci.com/github/Shakeskeyboarde/tsstyled)
[![coverage status](https://badgen.net/coveralls/c/github/Shakeskeyboarde/tsstyled/main)](https://coveralls.io/github/Shakeskeyboarde/tsstyled)

A small, fast, and simple CSS-in-JS solution for React.

- **Small**: Less than 4kb (minified and gzipped) and no dependencies.
- **Fast**: Faster than styled-components (benchmarks included).
- **Simple**: A minimal and intuitive API.
- **Typed**: Written in TypeScript with a focus on type safety and clarity.

---

**Table of contents**

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Compatibility](#compatibility)
  - [Community](#community)
- [Motivation](#motivation)
  - [Compared with other libraries](#compared-with-other-libraries)
  - [Benchmarks](#benchmarks)
- [The Basics](#the-basics)
  - [Styling HTML elements and components](#styling-html-elements-and-components)
  - [Extending the properties type](#extending-the-properties-type)
  - [Setting default property values](#setting-default-property-values)
  - [Creating global styles](#creating-global-styles)
  - [Defining keyframes and fonts](#defining-keyframes-and-fonts)
- [Theming](#theming)
  - [Creating a theme](#creating-a-theme)
  - [Using a theme](#using-a-theme)
  - [Overriding theme values](#overriding-theme-values)
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

---

## Getting Started

### Installation

Install the `tsstyled` package and its `react` peer dependency.

```sh
# With NPM
npm add tsstyled react

# With Yarn
yarn add tsstyled react
```

This library uses semantic versioning. Breaking changes will only be introduced in major version updates.

### Compatibility

- React >= 16.14.0
- IE >= 11

### Community

Do you have questions, suggestions, or issues? Join the [Discord](https://discord.gg/r8u2rHrrGZ) server!

## Motivation

I wanted a small CSS-in-JS solution for React, with zero dependencies, and strong types. I love the styled-components pattern, but Styled Components itself is too big and it's typings are [not the best](https://github.com/DefinitelyTyped/DefinitelyTyped/issues?q=is%3Aissue+is%3Aopen+styled-components). Emotion is smaller and generally better, but still not ideal. Then I found [Goober](https://npmjs.com/package/goober) which nearly convincing me not to write this library. If you're looking for a good solution, check it out too.

I still wrote this because it was just a fun side project, and because there were some different design choices I wanted to make. I've included a comparison of what I consider to be the key features of any CSS-in-JS library.

### Compared with other libraries

-   🟢 Supported
-   🟡 Partially supported
-   🔴 Not supported
-   ⭕ Not documented

|             | Feature                    | TSStyled | Goober | Styled Components | Emotion |
| ----------- | -------------------------- | -------- | ------ | ----------------- | ------- |
| **Library** |                            |          |        |                   |         |
|             | Bundle size (kB)           | 3.3      | 1.3    | 12.7              | 4.8     |
|             | Zero dependencies          | 🟢        | 🟢      | 🔴                 | 🔴       |
|             | TypeScript native          | 🟢        | 🟢      | 🔴                 | 🟢       |
| **API**     |                            |          |        |                   |         |
|             | Styled component pattern   | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | Dynamic styles             | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | Tagged template styles     | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | Object styles              | 🔴        | 🟢      | 🟢                 | 🟢       |
|             | Global styles              | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | Polymorphism (`as`)        | 🔴        | 🟢      | 🟢                 | 🟢       |
|             | Property mapping (`attrs`) | 🔴        | 🔴      | 🟢                 | 🔴       |
|             | Theming [1]                | 🟢        | 🟢      | 🟡                 | 🟡       |
|             | Non-global config          | 🟢        | 🔴      | 🟢                 | 🟢       |
|             | SSR                        | 🟢        | 🟢      | 🟢                 | 🟢       |
| **Style**   |                            |          |        |                   |         |
|             | CSS `@media`               | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | CSS `@keyframes`           | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | CSS `@font-face`           | 🟢        | ⭕      | ⭕                 | 🟢       |
|             | CSS `@import`              | 🟢        | ⭕      | 🔴                 | 🟢       |
|             | Other CSS `@` rules        | 🟢        | ⭕      | ⭕                 | ⭕       |
|             | Vendor prefixing [2]       | 🔴        | 🟡      | 🟢                 | 🟢       |
|             | Rule nesting               | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | Parent selectors (`&`)     | 🟢        | 🟢      | 🟢                 | 🟢       |
|             | Style mixins [3]           | 🟢        | 🟡      | 🟢                 | 🟢       |
|             | Styled component selectors | 🟢        | 🟢      | 🟢                 | 🟢       |

&nbsp;

- [1] Styled Components and Emotion support only a single theme, which must be typed using declaration merging.
- [2] Goober allows a prefix callback function to be configured, but does not provide automatic vendor prefixing.
- [3] Goober doesn't provide a `css` utility for creating mixins, but it does support function values in tagged templates.

TSStyled omits three key features supported by other libraries: Polymorphism using the `as` property, vendor prefixing, and object styles.

The automatic inclusion of the `as` property with support for any element or component, is inherently type unsafe. Full (non-styled) components can implement an `as` property and polymorphism safely, because they can limit the range of polymorphism. Strong typing is a key TSStyled goal, so this feature just doesn't fit.

Vendor prefixing [isn't as necessary as it used to be](https://css-tricks.com/is-vendor-prefixing-dead/). There are still a some uncommon cases where it might be needed, but prefixes can always be manually included. Style helpers are also a pretty good fit for this. The overhead and maintenance required to implement this didn't seem worth it.

Omitting object styling is a purely stylistic choice. In my opinion, tagged templates provide a better experience in the following ways...

- Cutting and pasting styles is simpler with tagged templates.
- Learning tagged templates is easier because it's closer to vanilla CSS.
- Intellisense and syntax checking are (arguably) better with tagged templates.
- Defining multiple CSS property "fallback" values is cleaner with tagged templates.
- Property ordering is guaranteed with tagged templates, whereas object property ordering is not part of the JS specification (especially when merging two objects).

### Benchmarks

The benchmark app is available [online](https://tsstyled.com/benchmark/), or by cloning the [TSStyled repository](https://github.com/Shakeskeyboarde/tsstyled) and running the `npm start` command.

## The Basics

First, create the styled API.

```tsx
import { createStyled } from 'tsstyled';

const styled = createStyled();
```

### Styling HTML elements and components

Style any HTML element type by using the tag name. The styled component supports all of the same props (included refs, which are forwarded) that the HTML element supports.

```tsx
const StyledDiv = styled('div')`
  color: black;
`;
```

Style any React component which accepts a `className` string property.

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

Set the display name of the styled component.

```tsx
const StyledDiv = styled('div', 'StyledDiv')``;
```

### Extending the properties type

The tagged template function returned by `styled` is generic. Any type passed to this the type parameter will extend (not replace) the styled component's properties.

```tsx
const StyledDiv = styled('div')<{ $font?: string }>`
  font-family: ${(props) => props.$font};
`;
```

**Note**: Any property name which starts with the `$` character will not be passed through to the underlying HTML element. So, the above `div` will not have a `$font` attribute when rendered.

### Setting default property values

React has the [defaultProps](https://reactjs.org/docs/typechecking-with-proptypes.html#default-prop-values) static property which can be used with styled components. However, there are some drawbacks...

- It is [deprecated](https://github.com/facebook/react/pull/16210) for function components as part of an [initiative](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md) to update React's `createElement` function.
- It is applied before `propTypes` which can lead to default values throwing errors.

TSStyled provides an alternative custom implementation called `propDefaults`. This cannot be deprecated by React, and it is applied after `propTypes`.

```tsx
const StyledButton = styled('button')``;

StyledButton.propDefaults = {
  type: 'submit',
};
```

### Creating global styles

Use the `styled.global` utility to create global style components.

```tsx
const GlobalStyle = styled.global`
  body, html {
    margin: 0;
    padding: 0;
  }
`;
```

Extend the component properties type using the tagged template generic parameter.

```tsx
const GlobalStyle = styled.global<{ $font?: string }>`
  body, html {
    font-family: ${(props) => props.$font};
  }
`;
```

### Defining keyframes and fonts

Defining keyframes or font-faces is the same as defining any other style. Since they are not scoped to any particular component, they should probably only be used in global styles. To prevent name collisions, use the `getId` utility to generate unique names.

```tsx
const openSansFont = getId('Open Sans');
const slideInAnimation = getId('slideIn');

const GlobalStyle = styled.global`
  @font-face {
    font-family: ${openSansFont};
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
         url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
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

const StyledDiv = styled('div')`
  font-family: ${openSansFont};
  animation-name: ${slideInAnimation};
`;
```

## Theming

A theme factory is provided instead of a single built-in theme. This makes themes strongly typed. It also loosely couples the theme implementation, so that third party theming is supported.

### Creating a theme

Themes are just values made available via a React context, and preferably using a React hook. The `createTheme` utility is provided to make that a one step process. It accepts the default theme value, and returns a theme hook function and provider component.

```tsx
const [useTheme, ThemeProvider] = createTheme({
  fgColor: 'black';
  bgColor: 'white';
});
```

### Using a theme

Pass the `useTheme` hook to `createStyled` when creating the styled API. The returned `styled` API will now expose a `props.theme` in styled template callbacks.

```tsx
const styled = createStyled(useTheme);

const ThemedDiv = styled('div')`
  color: ${(props) => props.theme.fgColor};
  background-color: ${(props) => props.theme.bgColor};
`;
```

**Note**: Any function that returns a theme can be used, not just the hook returned by `createTheme`.

### Overriding theme values

The provider returned by the `createTheme` utility allows theme values to be (all or partially) overridden. The following example inverts the fore and background colors.

```tsx
<ThemeProvider
  value={(current) => ({
    fgColor: current.bgColor,
    bgColor: current.fgColor,
  })}
>
  <ThemedDiv />
</ThemeProvider>
```

## Style syntax

Style syntax is CSS-like, and all CSS properties, selectors, and at-rules are supported. In addition, SCSS-like nesting is supported with parent selector references (`&`).

### Styling self

To apply styles directly to the HTML element or component being styled, use CSS properties at the top-level of the tagged template (no surrounding block).

```tsx
const StyledDiv = styled('div')`
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
const StyledDiv = styled('div')`
  .child {
    color: blue;
  }
`
```

The styled dynamic class will be automatically prepended to all selectors to make them "scoped".

```css
._s7y13d .child {
  color: blue;
}
```

### Styling other styled components

Every styled component (not global styles) has a static `selector` property which contains a unique class selector string that can be used to style that specific styled component.

```tsx
const StyledDiv = styled('div')`
  ${StyledOther.selector} {
    color: red;
  }
`;
```

The selector value is a simple string (eg. `".tss_s7y13d"`), so the tagged template interpolates it like any other string value, and it behaves just like the literal `.child` selector in the prevous example.

```css
._s7y13d .tss_s7y13d {
  color: red;
}
```

**Note**: This is slightly different than other styled-components libraries which will usually let you use the component itself as the template value (eg. `${StyledOther}` instead of `${StyledOther.selector}`). The static `selector` property improves type safety, clarity, and makes the selector string publicly accessible.

### Nesting rules

Nest rule blocks to create more complex selectors.

```tsx
const StyledDiv = styled('div')`
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

As noted above, the parent selector is automatically prepended to child selectors. This behavior can be overridden by using a parent selector reference (`&`) to inject the parent selector anywhere in the child selector. This includes injecting the parent selector multiple times to increase specificity, and is necessary when applying pseudo selectors (eg. `:hover`) directly to the styled component and not to a child element.

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

For any selector that contains `&`, the parent selector will replace the `&` character, and the parent selector will not be automatically prepended.

```css
._s7y13d._s7y13d {
  color: red;
}
._s7y13d:hover {
  color: blue;
}
.parent ._s7y13d {
  color: green;
}
```

### Using at-rules

All CSS at-rules are supported (except `@charset` which isn't allowed in `<style>` elements).

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

If a CSS property value is an empty string or null-ish (`null` or `undefined`), then the whole property will be omitted from the style.

```tsx
const StyledDiv = styled('div')`
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
const StyledDiv = styled('div')`
  // This is a comment.
  /* And so...
     ...is this. */
`;
```

## Style mixins (helpers)

The `css` tagged template utility returns a mixin (AKA: helper) function. When the returned function is called, it returns a style string with all values interpolated.

### Creating simple mixins

Mixins do not accept any parameters by default.

```tsx
const font = css`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: 1rem;
`;

const StyledDiv = styled('div')`
  color: red;
  ${font}
`;
```

**Note**: The above `font` constant is a function which accepts no arguments (ie. `() => string`).

### Creating parametric mixins

Helpers which accept parameters can be created by setting the generic type of the css tagged template utility.

```tsx
const font = css<{ scale?: number }>`
  font-family: Arial, sans-serif;
  font-weight: 400;
  font-size: ${(props) => props.scale || 1}rem;
`;

const StyledDiv = styled('div')`
  ${font({ scale: 2 })}
  color: red;
`;
```

## Server Side Rendering (SSR)

During SSR, there is no DOM and therefore no `document` global. TSStyled detects this and uses a very minimal "virtual" DOM behind the scenes. So, after rendering the document body, use the `renderStylesToString` utility to get all of the `<style>` elements (generated by TSStyled components) as a string.

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

During testing, there may be a DOM (eg. jsdom) and a `document` global. However, the `NODE_ENV` environment variable should also be set to `test` (Jest sets this automatically). If it is, the SSR implementation is used. So, use the same `renderStylesToString` utility used for SSR style rendering to check (eg. Jest snapshot test) your styles.

```tsx
expect(renderStylesToString()).toMatchSnapshot();
```
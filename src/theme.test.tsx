import { render } from '@testing-library/react';

import { createStyled, createTheme, renderStylesToHtmlString } from '.';

test('default theme', () => {
  const [useTheme] = createTheme({ color: 'blue' });
  const styled = createStyled(useTheme);
  const A = styled('div')`
    color: ${(_props, theme) => theme.color};
  `;
  const B = styled.global`
    color: ${(_props, theme) => theme.color};
  `;
  const { container } = render(
    <div>
      <A />
      <B />
    </div>,
  );

  expect(renderStylesToHtmlString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_1ctbf8z\\">
    ._1ctbf8z {
      color: blue;
    }
    </style>
    <style data-tss=\\"global\\">
    :root {
      color: blue;
    }
    </style>"
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      <div
        class="tss_<hash> _1ctbf8z"
      />
    </div>
  `);
});

test('theme overrides', () => {
  const [useTheme, ThemeProvider] = createTheme({ color: 'blue', backgroundColor: 'red' });
  const styled = createStyled(useTheme);
  const A = styled('div')`
    color: ${(_props, theme) => theme.color};
    background-color: ${(_props, theme) => theme.backgroundColor};
    font: serif;
  `;
  const B = styled.global`
    color: ${(_props, theme) => theme.color};
    background-color: ${(_props, theme) => theme.backgroundColor};
    font: sans-serif;
  `;
  const { container } = render(
    <ThemeProvider value={{ color: 'purple', backgroundColor: 'red' }}>
      <A />
      <B />
    </ThemeProvider>,
  );

  expect(renderStylesToHtmlString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_1tn6lbq\\">
    ._1tn6lbq {
      color: purple;
      background-color: red;
      font: serif;
    }
    </style>
    <style data-tss=\\"global\\">
    :root {
      color: purple;
      background-color: red;
      font: sans-serif;
    }
    </style>"
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _1tn6lbq"
    />
  `);
});

test('theme updates', () => {
  const [useTheme, ThemeProvider] = createTheme({ color: 'blue', backgroundColor: 'red' });
  const styled = createStyled(useTheme);
  const A = styled('div')`
    color: ${(_props, theme) => theme.color};
    background-color: ${(_props, theme) => theme.backgroundColor};
  `;
  const B = styled.global`
    color: ${(_props, theme) => theme.color};
    background-color: ${(_props, theme) => theme.backgroundColor};
  `;
  const { container, rerender } = render(
    <ThemeProvider value={{ color: 'purple', backgroundColor: 'red' }}>
      <A />
      <B />
    </ThemeProvider>,
  );

  expect(renderStylesToHtmlString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_1b75kmd\\">
    ._1b75kmd {
      color: purple;
      background-color: red;
    }
    </style>
    <style data-tss=\\"global\\">
    :root {
      color: purple;
      background-color: red;
    }
    </style>"
  `);

  rerender(
    <ThemeProvider value={{ color: 'green', backgroundColor: 'red' }}>
      <A />
      <B />
    </ThemeProvider>,
  );

  expect(renderStylesToHtmlString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_1b75kmd\\">
    ._1b75kmd {
      color: purple;
      background-color: red;
    }
    </style>
    <style data-tss=\\"global\\">
    :root {
      color: green;
      background-color: red;
    }
    </style>
    <style data-tss=\\"_fnpvxs\\">
    ._fnpvxs {
      color: green;
      background-color: red;
    }
    </style>"
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _fnpvxs"
    />
  `);
});

import { render } from '@testing-library/react';

import { createReactTheme, createStyled, renderStylesToString } from '.';

test('default theme', () => {
  const [useTheme] = createReactTheme({ color: 'blue' });
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

  expect(renderStylesToString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_136lazs\\">
    ._136lazs {
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
        class="tss_<hash> _136lazs"
      />
    </div>
  `);
});

test('theme overrides', () => {
  const [useTheme, ThemeProvider] = createReactTheme({ color: 'blue', backgroundColor: 'red' });
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

  expect(renderStylesToString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_1g3aazx\\">
    ._1g3aazx {
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
      class="tss_<hash> _1g3aazx"
    />
  `);
});

test('theme updates', () => {
  const [useTheme, ThemeProvider] = createReactTheme({ color: 'blue', backgroundColor: 'red' });
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

  expect(renderStylesToString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_6zieqm\\">
    ._6zieqm {
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

  expect(renderStylesToString()).toMatchInlineSnapshot(`
    "<style data-tss=\\"_6zieqm\\">
    ._6zieqm {
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
    <style data-tss=\\"_otd6i3\\">
    ._otd6i3 {
      color: green;
      background-color: red;
    }
    </style>"
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _otd6i3"
    />
  `);
});

import { render } from '@testing-library/react';
import React from 'react';
import { renderStylesToString, createStyled, createTheme } from '..';

test('default theme', () => {
  const [useTheme] = createTheme({ color: 'blue' });
  const styled = createStyled(useTheme);
  const A = styled('div')`
    color: ${(props) => props.theme.color};
  `;
  const B = styled.global`
    color: ${(props) => props.theme.color};
  `;
  const { container } = render(
    <div>
      <A />
      <B />
    </div>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"vvpswx\\">
._vvpswx {
  color: blue;
}
</style>
<style data-tss=\\"15iv4u5\\">
:root {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div>
  <div
    class="tss_txgcgv _vvpswx"
  />
</div>
`);
});

test('theme overrides', () => {
  const [useTheme, ThemeProvider] = createTheme({ color: 'blue', backgroundColor: 'red' });
  const styled = createStyled(useTheme);
  const A = styled('div')`
    color: ${(props) => props.theme.color};
    background-color: ${(props) => props.theme.backgroundColor};
  `;
  const B = styled.global`
    color: ${(props) => props.theme.color};
    background-color: ${(props) => props.theme.backgroundColor};
  `;
  const { container } = render(
    <ThemeProvider value={{ color: 'purple' }}>
      <A />
      <B />
    </ThemeProvider>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"hz4yuv\\">
._hz4yuv {
  color: purple;
  background-color: red;
}
</style>
<style data-tss=\\"11k1p4b\\">
:root {
  color: purple;
  background-color: red;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="tss_txgcgv _hz4yuv"
/>
`);
});

test('theme updates', () => {
  const [useTheme, ThemeProvider] = createTheme({ color: 'blue', backgroundColor: 'red' });
  const styled = createStyled(useTheme);
  const A = styled('div')`
    color: ${(props) => props.theme.color};
    background-color: ${(props) => props.theme.backgroundColor};
  `;
  const B = styled.global`
    color: ${(props) => props.theme.color};
    background-color: ${(props) => props.theme.backgroundColor};
  `;
  const { container, rerender } = render(
    <ThemeProvider value={(current) => ({ ...current, color: 'purple' })}>
      <A />
      <B />
    </ThemeProvider>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"hz4yuv\\">
._hz4yuv {
  color: purple;
  background-color: red;
}
</style>
<style data-tss=\\"11k1p4b\\">
:root {
  color: purple;
  background-color: red;
}
</style>"
`);

  rerender(
    <ThemeProvider value={(current) => ({ ...current, color: 'green' })}>
      <A />
      <B />
    </ThemeProvider>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"15n3pcy\\">
._15n3pcy {
  color: green;
  background-color: red;
}
</style>
<style data-tss=\\"2jt48u\\">
:root {
  color: green;
  background-color: red;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="tss_txgcgv _15n3pcy"
/>
`);
});

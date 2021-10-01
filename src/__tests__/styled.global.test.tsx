import { render } from '@testing-library/react';
import React from 'react';
import { createStyled, renderStylesToString } from '..';

const styled = createStyled();

test('global styles order', () => {
  const A = styled.global`
    color: red;
  `;
  const B = styled.global`
    color: blue;
  `;
  const { container } = render(
    <div>
      <B />
      <A />
      <B />
    </div>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"\\">
:root {
  color: blue;
}
</style>
<style data-tss=\\"\\">
:root {
  color: red;
}
</style>
<style data-tss=\\"\\">
:root {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`<div />`);
});

test('remove global style', () => {
  const A = styled.global`
    color: red;
  `;
  const B = styled.global`
    color: blue;
  `;
  const { container, rerender } = render(
    <div>
      <B />
      <A />
      <B />
    </div>,
  );
  rerender(
    <div>
      <A />
      <B />
    </div>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"\\">
:root {
  color: red;
}
</style>
<style data-tss=\\"\\">
:root {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`<div />`);
});

test('global styles always precede component styles', () => {
  const A = styled('div')`
    color: blue;
  `;
  const B = styled.global`
    color: red;
  `;
  const { container } = render(
    <div>
      <A />
      <B />
    </div>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"\\">
:root {
  color: red;
}
</style>
<style data-tss=\\"vvpswx\\">
._vvpswx {
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

test('parameterized global style', () => {
  const A = styled.global<{ color?: string; backgroundColor?: string }>`
    color: ${(props) => props.color};
    background-color: ${(props) => props.backgroundColor};
  `;
  A.propDefaults = { color: 'red', backgroundColor: 'blue' };
  const { container } = render(<A color={'green'} />);

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"\\">
:root {
  color: green;
  background-color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`null`);
});

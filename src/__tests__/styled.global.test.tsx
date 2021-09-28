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
"<style data-tss=\\"15iv4u5\\">
:root {
  color: blue;
}
</style>
<style data-tss=\\"1tezuq8\\">
:root {
  color: red;
}
</style>
<style data-tss=\\"15iv4u5\\">
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
"<style data-tss=\\"1tezuq8\\">
:root {
  color: red;
}
</style>
<style data-tss=\\"15iv4u5\\">
:root {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`<div />`);
});

test('global styles always follow component styles', () => {
  const A = styled.global`
    color: red;
  `;
  const B = styled('div')`
    color: blue;
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
<style data-tss=\\"1tezuq8\\">
:root {
  color: red;
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
"<style data-tss=\\"1qxvy7n\\">
:root {
  color: green;
  background-color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`null`);
});

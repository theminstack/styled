import { render } from '@testing-library/react';
import React from 'react';
import { createStyled, renderStylesToString } from '..';

const styled = createStyled();

test('style ordering', () => {
  const A = styled('div')<{ $color: string }>`
    color: ${(props) => props.$color};
  `;
  const B = styled('div')<{ $color: string }>`
    color: ${(props) => props.$color};
  `;
  const C = styled('div')<{ $color: string }>`
    color: ${(props) => props.$color};
  `;

  const { container } = render(
    <div>
      <C $color="red">
        <B $color="black" />
        <B $color="white" />
      </C>
      <A $color="yellow" />
      <C $color="purple" />
    </div>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"13ocvkr\\">
._13ocvkr {
  color: yellow;
}
</style>
<style data-tss=\\"1316060\\">
._1316060 {
  color: black;
}
</style>
<style data-tss=\\"1sxgnaw\\">
._1sxgnaw {
  color: white;
}
</style>
<style data-tss=\\"gmkj4c\\">
._gmkj4c {
  color: red;
}
</style>
<style data-tss=\\"1m5aoh\\">
._1m5aoh {
  color: purple;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div>
  <div
    class="tss_txgcgv _gmkj4c"
  >
    <div
      class="tss_txgcgv _1316060"
    />
    <div
      class="tss_txgcgv _1sxgnaw"
    />
  </div>
  <div
    class="tss_txgcgv _13ocvkr"
  />
  <div
    class="tss_txgcgv _1m5aoh"
  />
</div>
`);
});

test('direct restyle', () => {
  const A = styled('div')`
    color: red;
  `;
  const B = styled(A)`
    color: blue;
  `;
  const { container } = render(
    <div>
      <A />
      <B />
    </div>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"gmkj4c\\">
._gmkj4c {
  color: red;
}
</style>
<style data-tss=\\"1ah7rim\\">
._1ah7rim {
  color: red;
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div>
  <div
    class="tss_txgcgv _gmkj4c"
  />
  <div
    class="tss_txgcgv tss_txgcgv _1ah7rim"
  />
</div>
`);
});

test('indirect restyle', () => {
  const A = styled('div')`
    color: red;
  `;
  const B = (props: { className?: string }) => <A className={props.className} />;
  const C = styled(B)`
    color: blue;
  `;
  const { container } = render(<C />);

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"gmkj4c\\">
._gmkj4c {
  color: red;
}
</style>
<style data-tss=\\"2icnr3\\">
._2icnr3 {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="tss_1hlz8ue _2icnr3 tss_txgcgv _gmkj4c"
/>
`);
});

test('style other', () => {
  const A = styled('div')`
    color: red;
  `;
  const B = styled('div')`
    ${A.selector} {
      color: blue;
    }
  `;
  const { container } = render(
    <B>
      <A />
    </B>,
  );

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"gmkj4c\\">
._gmkj4c {
  color: red;
}
</style>
<style data-tss=\\"axmm1n\\">
._axmm1n .tss_txgcgv {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="tss_txgcgv _axmm1n"
>
  <div
    class="tss_txgcgv _gmkj4c"
  />
</div>
`);
});

test('update', () => {
  const A = styled('div')<{ $color?: string }>`
    color: ${(props) => props.$color};
  `;
  A.propDefaults = { $color: 'red' };
  const { container, rerender } = render(<A />);

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"gmkj4c\\">
._gmkj4c {
  color: red;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="tss_txgcgv _gmkj4c"
/>
`);

  rerender(<A $color={'blue'} />);

  expect(renderStylesToString()).toMatchInlineSnapshot(`
"<style data-tss=\\"vvpswx\\">
._vvpswx {
  color: blue;
}
</style>"
`);
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  class="tss_txgcgv _vvpswx"
/>
`);
});

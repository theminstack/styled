import { render } from '@testing-library/react';

import { createStyled } from '.';

const styled = createStyled();

test('style ordering', () => {
  const A = styled('div')<{ readonly $color: string }>`
    color: ${(props) => props.$color};
  `;
  const B = styled('div')<{ readonly $color: string }>`
    color: ${(props) => props.$color};
  `;
  const C = styled('div')<{ readonly $color: string }>`
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

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_1a0doa9"
      >
        ._1a0doa9 {
      color: black;
    }
      </style>,
      <style
        data-tss="_7wuc41"
      >
        ._7wuc41 {
      color: white;
    }
      </style>,
      <style
        data-tss="_xq7739"
      >
        ._xq7739 {
      color: red;
    }
      </style>,
      <style
        data-tss="_10netjm"
      >
        ._10netjm {
      color: yellow;
    }
      </style>,
      <style
        data-tss="_4zh4ew"
      >
        ._4zh4ew {
      color: purple;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      <div
        class="tss_<hash> _xq7739"
      >
        <div
          class="tss_<hash> _1a0doa9"
        />
        <div
          class="tss_<hash> _7wuc41"
        />
      </div>
      <div
        class="tss_<hash> _10netjm"
      />
      <div
        class="tss_<hash> _4zh4ew"
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
  const C = styled(B)`
    color: green;
  `;
  const { container } = render(
    <div>
      <A />
      <B />
      <C />
    </div>,
  );

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_xq7739"
      >
        ._xq7739 {
      color: red;
    }
      </style>,
      <style
        data-tss="_1j1b7vr"
      >
        ._1j1b7vr {
      color: red;
      color: blue;
    }
      </style>,
      <style
        data-tss="_1fv5bds"
      >
        ._1fv5bds {
      color: red;
      color: blue;
      color: green;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      <div
        class="tss_<hash> _xq7739"
      />
      <div
        class="tss_<hash> _1j1b7vr"
      />
      <div
        class="tss_<hash> _1fv5bds"
      />
    </div>
  `);
});

test('indirect restyle', () => {
  const A = styled('div')`
    color: red;
  `;
  const B = (props: { readonly className?: string }) => <A className={props.className} />;
  const C = styled(B)`
    color: blue;
  `;
  const { container } = render(<C />);

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_xq7739"
      >
        ._xq7739 {
      color: red;
    }
      </style>,
      <style
        data-tss="_136lazs"
      >
        ._136lazs {
      color: blue;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _136lazs tss_<hash> _xq7739"
    />
  `);
});

test('style other', () => {
  const A = styled('div')`
    color: red;
  `;
  const B = styled('div')`
    ${A} {
      color: blue;
    }
  `;
  const { container } = render(
    <B>
      <A />
    </B>,
  );

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_xq7739"
      >
        ._xq7739 {
      color: red;
    }
      </style>,
      <style
        data-tss="_cb9na3"
      >
        ._cb9na3 .tss_&lt;hash&gt; {
      color: blue;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _cb9na3"
    >
      <div
        class="tss_<hash> _xq7739"
      />
    </div>
  `);
});

test('update', () => {
  const A = styled('div')<{ readonly $color?: string }>`
    color: ${(props) => props.$color};
  `;
  A.defaultProps = { $color: 'red' };
  const { container, rerender } = render(<A />);

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_xq7739"
      >
        ._xq7739 {
      color: red;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _xq7739"
    />
  `);

  rerender(<A $color={'blue'} />);

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_xq7739"
      >
        ._xq7739 {
      color: red;
    }
      </style>,
      <style
        data-tss="_136lazs"
      >
        ._136lazs {
      color: blue;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _136lazs"
    />
  `);
});

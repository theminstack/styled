import { render } from '@testing-library/react';

import { createStyled } from '.';

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

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_1buk3pm"
      >
        ._1buk3pm {
      color: black;
    }
      </style>,
      <style
        data-tss="_iv6lka"
      >
        ._iv6lka {
      color: white;
    }
      </style>,
      <style
        data-tss="_ga4f32"
      >
        ._ga4f32 {
      color: red;
    }
      </style>,
      <style
        data-tss="_1hejvwp"
      >
        ._1hejvwp {
      color: yellow;
    }
      </style>,
      <style
        data-tss="_1t908ub"
      >
        ._1t908ub {
      color: purple;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      <div
        class="tss_<hash> _ga4f32"
      >
        <div
          class="tss_<hash> _1buk3pm"
        />
        <div
          class="tss_<hash> _iv6lka"
        />
      </div>
      <div
        class="tss_<hash> _1hejvwp"
      />
      <div
        class="tss_<hash> _1t908ub"
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
        data-tss="_ga4f32"
      >
        ._ga4f32 {
      color: red;
    }
      </style>,
      <style
        data-tss="_aks53w"
      >
        ._aks53w {
      color: red;
      color: blue;
    }
      </style>,
      <style
        data-tss="_1tlkeuz"
      >
        ._1tlkeuz {
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
        class="tss_<hash> _ga4f32"
      />
      <div
        class="tss_<hash> _aks53w"
      />
      <div
        class="tss_<hash> _1tlkeuz"
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

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_ga4f32"
      >
        ._ga4f32 {
      color: red;
    }
      </style>,
      <style
        data-tss="_1ctbf8z"
      >
        ._1ctbf8z {
      color: blue;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _1ctbf8z tss_<hash> _ga4f32"
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
        data-tss="_ga4f32"
      >
        ._ga4f32 {
      color: red;
    }
      </style>,
      <style
        data-tss="_1cr3af4"
      >
        ._1cr3af4 .tss_&lt;hash&gt; {
      color: blue;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _1cr3af4"
    >
      <div
        class="tss_<hash> _ga4f32"
      />
    </div>
  `);
});

test('update', () => {
  const A = styled('div')<{ $color?: string }>`
    color: ${(props) => props.$color};
  `;
  A.defaultProps = { $color: 'red' };
  const { container, rerender } = render(<A />);

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_ga4f32"
      >
        ._ga4f32 {
      color: red;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _ga4f32"
    />
  `);

  rerender(<A $color={'blue'} />);

  expect(document.querySelectorAll('head style')).toMatchInlineSnapshot(`
    NodeList [
      <style
        data-tss="_ga4f32"
      >
        ._ga4f32 {
      color: red;
    }
      </style>,
      <style
        data-tss="_1ctbf8z"
      >
        ._1ctbf8z {
      color: blue;
    }
      </style>,
    ]
  `);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="tss_<hash> _1ctbf8z"
    />
  `);
});

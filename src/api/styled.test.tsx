/* eslint-disable max-lines */
import { type RenderOptions, getByTestId, render } from '@testing-library/react';
import { htmlTagNames } from 'html-tag-names';
import { type ReactElement } from 'react';

import { styled, StyledTest } from '../index.js';
import { resetIds } from '../util/id.js';

const renderTest = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, { ...options, wrapper: StyledTest });
};

describe('styled', () => {
  test('inject into head', () => {
    const A = styled.div`
      color: red;
    `;
    expect(render(<A />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_rmsdp54ux1_ _rmssp5w12l_"
        />
      </div>
    `);
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style
          data-styled="rms"
        >
          ._rmsdp54ux1_ {
        color: red;
      }
        </style>
      </head>
    `);
  });

  test('styled div', () => {
    const A = styled.div`
      display: flex;
    `;
    expect(
      renderTest(
        <A>
          <div>foo</div>
        </A>,
      ).container,
    ).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_"
        >
          <div>
            foo
          </div>
        </div>
        <style>
          
          ._test-dynamic-0_ {
            display: flex;
          }
          
        </style>
      </div>
    `);
  });

  test('style custom component', () => {
    const A = ({ className, children }: any) => <div className={className}>{children}</div>;
    const B = styled(A)`
      color: red;
    `;
    expect(
      renderTest(
        <B>
          <span>foo</span>
        </B>,
      ).container,
    ).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_"
        >
          <span>
            foo
          </span>
        </div>
        <style>
          
          ._test-dynamic-0_ {
            color: red;
          }
          
        </style>
      </div>
    `);
  });

  test('restyle styled component', () => {
    const A = styled.div`
      color: red;
    `;
    const B = styled(A)`
      color: blue;
    `;
    expect(renderTest(<B />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_ _test-static-1_"
        />
        <style>
          
          ._test-dynamic-0_ {
            color: red;
            color: blue;
          }
          
        </style>
      </div>
    `);
  });

  test('omit non-attributes', () => {
    const A = styled.div<any>`
      color: ${(props) => props.$color};
    `;
    const B = (props: any) => {
      return <>{JSON.stringify(props)}</>;
    };
    const C = styled(B)<any>`
      color: ${(props) => props.$color};
    `;
    expect(renderTest(<A $color="red" />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_"
        />
        <style>
          
          ._test-dynamic-0_ {
            color: red;
          }
          
        </style>
      </div>
    `);
    expect(renderTest(<C $color="blue" />).container).toMatchInlineSnapshot(`
      <div>
        {"$color":"blue","className":"_test-dynamic-0_ _test-static-0_"}
        <style>
          
          ._test-dynamic-0_ {
            color: blue;
          }
          
        </style>
      </div>
    `);
  });

  test('restyle with an unstyled component intervening', () => {
    const A = styled.div`
      color: red;
    `;
    const B = (props: any) => <A {...props} />;
    const C = styled(B)`
      color: blue;
    `;
    expect(renderTest(<C />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-1_ _test-static-1_ _test-static-0_"
        />
        <style>
          
          ._test-dynamic-1_ {
            color: red;
            color: blue;
          }
          ._test-dynamic-0_ {
            color: blue;
          }
          
        </style>
      </div>
    `);
  });

  test('select styled component', () => {
    const A = styled.div``;
    const B = styled.div`
      ${A} {
        color: red;
      }
    `;
    expect(
      renderTest(
        <B>
          <A />
        </B>,
      ).container,
    ).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-1_"
        >
          <div
            class="_test-dynamic-1_ _test-static-0_"
          />
        </div>
        <style>
          
          ._test-dynamic-0_ ._test-static-0_ {
            color: red;
          }
          
        </style>
      </div>
    `);
  });

  test('dynamic values', () => {
    const A = styled.div<any>`
      color: ${(props) => props.$color};
    `;
    const { container, rerender } = renderTest(<A $color={'red'} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_"
        />
        <style>
          
          ._test-dynamic-0_ {
            color: red;
          }
          
        </style>
      </div>
    `);
    rerender(<A $color="blue" />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-1_ _test-static-0_"
        />
        <style>
          
          ._test-dynamic-1_ {
            color: blue;
          }
          
        </style>
      </div>
    `);
    rerender(<A $color="red" />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_"
        />
        <style>
          
          ._test-dynamic-0_ {
            color: red;
          }
          
        </style>
      </div>
    `);
  });

  test('displayName', () => {
    resetIds();
    const A = styled.div.withConfig({ displayName: 'Foo' })`
      color: red;
    `;
    resetIds();
    const B = styled.div`
      color: red;
    `;
    resetIds();
    const C = styled.div`
      color: red;
    `;
    expect(A.displayName).toEqual('Foo');
    expect(B.displayName).toEqual('Styled(div)');
    expect(A.toString()).not.toEqual(B.toString());
    expect(B.toString()).toEqual(C.toString());
  });

  describe('HTML element types', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation((message) => {
        expect(message).toMatch(/(cannot appear as a child|unrecognized in this browser)/);
      });
    });

    htmlTagNames.forEach((tagName) => {
      test('styled("' + tagName + '")', () => {
        const Test = styled(tagName)``;
        const { container } = renderTest(<Test data-testid="test" />);
        expect(getByTestId(container, 'test').tagName.toLocaleLowerCase()).toBe(tagName.toLocaleLowerCase());
      });

      test('styled.' + tagName, () => {
        const Test = (styled[tagName as keyof JSX.IntrinsicElements] as any)``;
        const { container } = renderTest(<Test data-testid="test" />);
        expect(getByTestId(container, 'test').tagName.toLocaleLowerCase()).toBe(tagName.toLocaleLowerCase());
      });
    });
  });
});

describe('styled.global', () => {
  test('mount order', () => {
    const A = styled.global`
      color: red;
    `;
    const B = styled.global`
      color: blue;
    `;
    expect(
      render(
        <>
          <B />
          <A />
        </>,
      ).container,
    ).toMatchInlineSnapshot(`<div />`);
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style
          data-styled-global="rms"
        >
          :root {
        color: blue;
      }
        </style>
        <style
          data-styled-global="rms"
        >
          :root {
        color: red;
      }
        </style>
      </head>
    `);
  });

  test('remove on unmount', () => {
    const A = styled.global`
      color: red;
    `;
    const { unmount } = render(<A />);
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style
          data-styled-global="rms"
        >
          :root {
        color: red;
      }
        </style>
      </head>
    `);
    unmount();
    expect(document.head).toMatchInlineSnapshot(`<head />`);
  });

  test('before component styles', () => {
    const A = styled.div`
      color: red;
    `;
    const B = styled.global`
      color: blue;
    `;
    const { rerender } = render(
      <>
        <A />
      </>,
    );
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style
          data-styled="rms"
        >
          ._rmsdp54ux1_ {
        color: red;
      }
        </style>
      </head>
    `);
    rerender(
      <>
        <A />
        <B />
      </>,
    );
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style
          data-styled-global="rms"
        >
          :root {
        color: blue;
      }
        </style>
        <style
          data-styled="rms"
        >
          ._rmsdp54ux1_ {
        color: red;
      }
        </style>
      </head>
    `);
  });
});

describe('styled.string', () => {
  test('blank values', () => {
    expect(styled.string`
      color: ${null};
      color: ${undefined};
      color: ${false};
      color: ${0};
    `).toMatchInlineSnapshot(`
      "
            color: ;
            color: ;
            color: ;
            color: 0;
          "
    `);
  });
});

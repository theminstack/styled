/* eslint-disable unicorn/consistent-function-scoping */
import { type RenderOptions, getByTestId, render as renderBase } from '@testing-library/react';
import { htmlTagNames } from 'html-tag-names';
import { type ReactElement } from 'react';

import { styled, StyledTest } from '../index.js';

const render = (ui: ReactElement, options?: RenderOptions) => {
  return renderBase(ui, { ...options, wrapper: StyledTest });
};

describe('styled', () => {
  test('styled div', () => {
    const A = styled.div`
      display: flex;
    `;
    expect(
      render(
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
      render(
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
    expect(render(<B />).container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-0_"
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
    expect(render(<A $color="red" />).container).toMatchInlineSnapshot(`
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
    expect(render(<C $color="blue" />).container).toMatchInlineSnapshot(`
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
    expect(render(<C />).container).toMatchInlineSnapshot(`
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
      render(
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
    //
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
        const { container } = render(<Test data-testid="test" />);
        expect(getByTestId(container, 'test').tagName.toLocaleLowerCase()).toBe(tagName.toLocaleLowerCase());
      });

      test('styled.' + tagName, () => {
        const Test = (styled[tagName as keyof JSX.IntrinsicElements] as any)``;
        const { container } = render(<Test data-testid="test" />);
        expect(getByTestId(container, 'test').tagName.toLocaleLowerCase()).toBe(tagName.toLocaleLowerCase());
      });
    });
  });
});

describe('styled.global', () => {
  //
});

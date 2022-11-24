import { render } from '@testing-library/react';

import { getId, styled, StyledTest } from '../index.js';

describe('StyledTest', () => {
  test('non styled', () => {
    expect(render(<div />, { wrapper: StyledTest }).container).toMatchInlineSnapshot(`
      <div>
        <div />
      </div>
    `);
  });

  test('simple render', () => {
    const keyframes = getId();
    const A = styled('div')`
      padding: 1rem;
    `;
    const B = styled('div')`
      color: blue;
      ${A} {
        padding: 0;
      }
    `;
    const GlobalStyle = styled.global`
      @keyframes ${keyframes} {
        from {
          color: red;
        }
        to {
          color: blue;
        }
      }
      padding: 2rem;
      ${B} {
        background: grey;
      }
    `;
    const { container } = render(
      <>
        <GlobalStyle />
        <A />
        <B />
      </>,
      { wrapper: StyledTest },
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="_test-dynamic-0_ _test-static-1_"
        />
        <div
          class="_test-dynamic-2_ _test-static-3_"
        />
        <style>
          
          @keyframes _test-static-4_ {
            from {
              color: red;
            }
            to {
              color: blue;
            }
          }
          :root {
            padding: 2rem;
          }
          ._test-static-3_ {
            background: grey;
          }
          ._test-dynamic-0_ {
            padding: 1rem;
          }
          ._test-dynamic-2_ {
            color: blue;
          }
          ._test-dynamic-2_ ._test-static-1_ {
            padding: 0;
          }
          
        </style>
      </div>
    `);
  });
});

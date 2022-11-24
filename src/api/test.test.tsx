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
          class="_test-dynamic-0_ _test-static-0_"
        />
        <div
          class="_test-dynamic-1_ _test-static-1_"
        />
        <style>
          
          @keyframes _test-static-2_ {
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
          ._test-static-1_ {
            background: grey;
          }
          ._test-dynamic-0_ {
            padding: 1rem;
          }
          ._test-dynamic-1_ {
            color: blue;
          }
          ._test-dynamic-1_ ._test-static-0_ {
            padding: 0;
          }
          
        </style>
      </div>
    `);
  });
});

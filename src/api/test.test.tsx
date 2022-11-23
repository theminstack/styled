import { render } from '@testing-library/react';

import { getId, styled, StyledTest } from '../index.js';

describe('StyledTest', () => {
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
          class="_test0_ _test1_"
        />
        <div
          class="_test2_ _test3_"
        />
        <style>
          
          @keyframes _test4_ {
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
          ._test3_ {
            background: grey;
          }
          ._test0_ {
            padding: 1rem;
          }
          ._test2_ {
            color: blue;
          }
          ._test2_ ._test1_ {
            padding: 0;
          }
          
        </style>
      </div>
    `);
  });
});

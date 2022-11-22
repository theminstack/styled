import { render } from '@testing-library/react';

import { styled } from './styled.js';
import { StyledTest } from './test.js';

describe('StyledTest', () => {
  test('simple render', () => {
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
          class="_rmsd_test_0 _rmss_test_0"
        />
        <div
          class="_rmsd_test_1 _rmss_test_1"
        />
        <style>
          
          :root {
            padding: 2rem;
          }
          ._rmss_test_1 {
            background: grey;
          }
          ._rmsd_test_0 {
            padding: 1rem;
          }
          ._rmsd_test_1 {
            color: blue;
          }
          ._rmsd_test_1 ._rmss_test_0 {
            padding: 0;
          }
          
        </style>
      </div>
    `);
  });
});

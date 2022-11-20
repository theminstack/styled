import { render } from '@testing-library/react';

import { styled } from './styled.js';
import { StyledTest } from './test.js';

describe('StyledTest', () => {
  test('simple render', () => {
    const GlobalStyle = styled.global`
      padding: 2rem;
    `;
    const StyledDiv = styled('div')`
      color: blue;
    `;
    const { container } = render(
      <>
        <GlobalStyle />
        <StyledDiv />
      </>,
      { wrapper: StyledTest },
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="undefined _rmsd_test_0 _rmss_test_0"
        />
        <style>
          
          :root {
            padding: 2rem;
          }
          ._rmsd_test_0 {
            color: blue;
          }
          
        </style>
      </div>
    `);
  });
});

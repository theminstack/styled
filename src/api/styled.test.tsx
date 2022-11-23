import { type RenderOptions, getByTestId, render as renderBase } from '@testing-library/react';
import { htmlTagNames } from 'html-tag-names';
import { type ReactElement } from 'react';

import { styled, StyledTest } from '../index.js';

const render = (ui: ReactElement, options?: RenderOptions) => {
  return renderBase(ui, { ...options, wrapper: StyledTest });
};

describe('styled', () => {
  test('styled div', () => {
    //
  });

  test('style custom component', () => {
    //
  });

  test('restyle styled component', () => {
    //
  });

  test('omit non-attributes', () => {
    //
  });

  test('restyling with an unstyled component intervening', () => {
    //
  });

  test('select styled component', () => {
    //
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

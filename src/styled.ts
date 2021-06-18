import { createElement, ReactElement } from 'react';
import { styledComponentMarker } from './constants';
import { getId } from './utils/getId';
import { IStyled } from './types/IStyled';
import { IStyledTemplate } from './types/IStyledTemplate';
import { IStyledTemplateBase } from './types/IStyledTemplateBase';
import { StylableComponent } from './types/StylableComponent';
import { StyleValue } from './types/StyleValue';

export const styled: IStyled = (type: string | StylableComponent<any>, displayName?: string): IStyledTemplate<any> => {
  return getStyledTemplate(type, displayName);
};

function getStyledTemplate(
  type: string | StylableComponent<any>,
  displayName: string | undefined,
): IStyledTemplate<any> {
  return Object.assign(getStyledTemplateBase(type, displayName), {
    props() {
      return getStyledTemplateBase(type, displayName);
    },
  });
}

function getStyledTemplateBase(
  type: string | StylableComponent<any>,
  displayName: string | undefined,
): IStyledTemplateBase<any> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: StyleValue<any>[]) => {
      const idClassNameSelector = `.${getId(displayName)}`;

      return Object.assign(
        (props: any): ReactElement => {
          return createElement(type, props);
        },
        {
          [styledComponentMarker]: true as const,
          toString: () => idClassNameSelector,
        },
      );
    },
    {
      use() {
        return getStyledTemplateBase(type, displayName);
      },
      set() {
        return getStyledTemplateBase(type, displayName);
      },
      map() {
        return getStyledTemplateBase(type, displayName);
      },
    },
  );
}

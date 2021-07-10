import { ComponentType } from 'react';
import { StyleValue } from './StyleValue';

export interface IStyledMetadata<TInnerProps extends {}> {
  base: string | ComponentType;
  mapFunctions: ((props: {}) => TInnerProps)[];
  templateRawStringsArray: readonly string[];
  templateValues: StyleValue<TInnerProps>[];
  isSelectable: boolean;
}

import { styledSelectorMarker } from '../constants';

/**
 * This type can be used as selectors in style tagged template
 * strings.
 */
export interface IStyledSelector {
  readonly [styledSelectorMarker]: true;
  /** Returns a selector for the styled component. */
  toString(): string;
}

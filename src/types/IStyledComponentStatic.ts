import { styledComponentMarker } from '../constants';

export interface IStyledComponentStatic {
  readonly [styledComponentMarker]: true;
  /** Returns a selector for the styled component. */
  toString(): string;
}

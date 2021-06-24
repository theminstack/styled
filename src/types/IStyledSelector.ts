import { styledComponentMarker } from '../constants';

/**
 * Values of this type can be used as selectors in tagged template
 * style strings. The two argument overload of the `styled` function
 * returns styled components which implement this interface.
 *
 * ```tsx
 * const Foo = styled('div', 'Foo');
 * const Bar = styled('div')`
 *   ${Foo} {
 *     color: red;
 *   }
 * `;
 * ```
 */
export interface IStyledSelector {
  /**
   * @ignore
   */
  readonly [styledComponentMarker]: true;
  /**
   * Returns a selector for a specific styled component.
   */
  toString(): string;
}

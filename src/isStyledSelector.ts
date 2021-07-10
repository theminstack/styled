import { styledComponentMetadataKey } from './constants';
import { isStyled } from './isStyled';

/**
 * Returns true if the value is a styled component which supports
 * being used as a selector value in a tagged template string.
 *
 * ```tsx
 * // Explicit display named components are selectable.
 * const Foo = styled('div', 'Foo')``;
 * // Implicitly display named components are not selectable.
 * const Bar = styled('div')``;
 *
 * isStyledSelector(Foo); // true
 * isStyledSelector(Bar); // false
 *
 * const Baz = styled('div')`
 *   ${Foo} {
 *     color: red;
 *   }
 * `;
 * ```
 */
export function isStyledSelector(value: unknown): boolean {
  return isStyled(value) && value[styledComponentMetadataKey].isSelectable === true;
}

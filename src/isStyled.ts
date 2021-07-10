import { styledComponentMetadataKey } from './constants';
import { IStyledComponent } from './types/IStyledComponent';

/**
 * Returns true if the component is a styled component.
 *
 * ```tsx
 * const Foo = styled('div')``;
 * const Bar = () => null;
 *
 * isStyled(Foo); // true
 * isStyled(Bar); // false
 * ```
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isStyled(component: unknown): component is IStyledComponent<{}> {
  return typeof component === 'object' && component != null && styledComponentMetadataKey in component;
}

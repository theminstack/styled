import { styledComponentMarker } from './constants';

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
export function isStyled(component: unknown): boolean {
  return (
    typeof component === 'object' &&
    component != null &&
    styledComponentMarker in component &&
    typeof (component as { [styledComponentMarker]?: unknown })[styledComponentMarker] === 'boolean'
  );
}

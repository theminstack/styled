import { styledSelectorMarker } from '../constants';

/**
 * Returns true if the component is styled and can be used as a
 * style tagged template selector value.
 */
export function isStyledComponent(component: unknown): boolean {
  return typeof component === 'function' && styledSelectorMarker in component;
}

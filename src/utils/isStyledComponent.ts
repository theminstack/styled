import { styledComponentMarker } from '../constants';

/**
 * Returns true if the component is styled and can be used as a
 * style tagged template selector value.
 */
export function isStyledComponent(component: Function): boolean {
  return styledComponentMarker in component;
}

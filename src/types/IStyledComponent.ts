import { ReactElement } from 'react';
import { IStyledComponentStatic } from './IStyledComponentStatic';

/**
 * Component type returned by the {@link styled} tagged template function.
 *
 * In addition to being a styled React element, components of this
 * type can also be used as selectors in style tagged template
 * strings.
 *
 * ```ts
 * const ComponentA = styled('div')``;
 * const ComponentB = styled('div')`
 *   ${ComponentA}: {
 *     color: blue;
 *   }
 * `
 * ```
 */
export interface IStyledComponent<TProps> extends IStyledComponentStatic {
  (props: TProps): ReactElement<any, any> | null;
}

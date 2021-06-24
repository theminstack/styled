import { ReactElement } from 'react';
import { styledComponentMarker } from '../constants';

/**
 * Component type returned by the {@link styled} tagged template function.
 */
export interface IStyledComponent<TProps> {
  /**
   * React functional component.
   *
   * **Note**: Styled components have forwarded refs and are therefore
   * exotic components, which are not really callable.
   */
  (props: TProps): ReactElement<any, any> | null;
  displayName: string;
  /**
   * @ignore
   */
  [styledComponentMarker]: boolean;
}

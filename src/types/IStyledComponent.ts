import { ReactElement, WeakValidationMap } from 'react';
import { styledComponentMarker } from '../constants';

/**
 * Component type returned by the {@link styled} tagged template function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IStyledComponent<TProps extends {}, TInnerProps extends {} = TProps> {
  /**
   * React functional component.
   *
   * **Note**: Styled components have forwarded refs and are therefore
   * exotic components, which are not really callable.
   */
  (props: TProps): ReactElement | null;
  displayName: string;
  propTypes?: WeakValidationMap<TProps>;
  /**
   * @ignore
   */
  [styledComponentMarker]: boolean;
}

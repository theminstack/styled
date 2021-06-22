import { ReactElement } from 'react';

/**
 * Component type returned by the {@link styled} tagged template function.
 */
export interface IStyledComponent<TProps> {
  (props: TProps): ReactElement<any, any> | null;
  displayName: string;
}

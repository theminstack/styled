import { InferProps } from './InferProps';
import { IStyledComponent } from './IStyledComponent';
import { Flat } from './Utilities';

/**
 * Infer the inner props of a styled component. This is used
 * internally to maintain the inner props type for restyling, which
 * avoids a potential type safety gotcha: A styled component may
 * remove input props, and a restyle may re-add the removed prop
 * with an incompatible type.
 */
export type InferInnerProps<TComponent> = TComponent extends IStyledComponent<infer TOuterProps, infer TInnerProps>
  ? Flat<TOuterProps & Omit<TInnerProps, keyof TOuterProps>>
  : InferProps<TComponent>;

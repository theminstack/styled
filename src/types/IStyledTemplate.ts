import { IStyledTemplateMod } from './IStyledTemplateMod';
import { Flat } from './Utilities';

/**
 * Styled template function with static utility methods for modifying
 * the styled component's prop values and replacing the default
 * component props type.
 */
export interface IStyledTemplate<TStatic, TProps> extends IStyledTemplateMod<TStatic, TProps, TProps, TProps> {
  /**
   * Change the styled component props type to new type that is
   * assignable to the original props type. Optionally, provide a
   * mapping function to modify the incoming props.
   */
  props<TNewProps extends Partial<TProps> & Record<string, any>>(
    cb?: (props: TNewProps) => TNewProps,
  ): IStyledTemplateMod<TStatic, Flat<TNewProps>, TProps, Flat<TNewProps>>;
  /**
   * Change the styled component props type and provide a mapping
   * function to the convert the new type to the wrapped component's
   * props type.
   */
  props<TNewOuterProps, TNewInnerProps extends Partial<TProps> & Record<string, any>>(
    cb: (props: TNewOuterProps) => Partial<TProps> & TNewInnerProps,
  ): IStyledTemplateMod<TStatic, Flat<TNewOuterProps>, TProps, Flat<TNewInnerProps>>;
}

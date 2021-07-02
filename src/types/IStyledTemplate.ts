import { IStyledTemplateMod } from './IStyledTemplateMod';
import { Flat, FlatClean, NonStrictPick } from './Utilities';

/**
 * Styled template function with static utility methods for modifying
 * the styled component's prop values and replacing the default
 * component props type.
 */
export interface IStyledTemplate<TStatic extends {}, TOuterProps extends {}, TInnerProps extends {} = TOuterProps>
  extends IStyledTemplateMod<TStatic, TOuterProps, TInnerProps> {
  /**
   * Change the styled component props type to new type that
   * _extends_ the original props type.
   */
  props<TNewProps extends NonStrictPick<TOuterProps & TInnerProps, keyof TNewProps>>(options?: {
    extend?: true;
  }): IStyledTemplateMod<TStatic, FlatClean<TOuterProps & TNewProps>, TInnerProps>;
  /**
   * Change the styled component props type to new type that is
   * _assignable_ to the original props type.
   */
  props<TNewProps extends TOuterProps & TInnerProps>(options: {
    extend: false;
  }): IStyledTemplateMod<TStatic, Flat<TNewProps>, TInnerProps>;
  /**
   * Change the styled component props type to a new type that is
   * _not assignable_, and provide a mapping function to the convert
   * the new type to the wrapped component's props type.
   */
  props<TNewOuterProps extends {}, TNewInnerProps extends TInnerProps & Record<string, any>>(
    cb: (props: TNewOuterProps) => TNewInnerProps,
  ): IStyledTemplateMod<TStatic, Flat<TNewOuterProps>, TInnerProps, Flat<TNewInnerProps>>;
}

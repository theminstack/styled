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
   * _assignable_ to the original props type.
   */
  props<TNewProps extends Partial<TProps> & Record<string, any>>(options?: {
    extend?: false;
  }): IStyledTemplateMod<TStatic, Flat<TNewProps>, TProps, Flat<TNewProps>>;
  /**
   * Change the styled component props type to a new type that is
   * _not assignable_, and provide a mapping function to the convert
   * the new type to the wrapped component's props type.
   */
  props<TNewOuterProps, TNewInnerProps extends Partial<TProps> & Record<string, any>>(
    map: (props: TNewOuterProps) => Partial<TProps> & TNewInnerProps,
  ): IStyledTemplateMod<TStatic, Flat<TNewOuterProps>, TProps, Flat<TNewInnerProps>>;
  /**
   * Change the styled component props type to new type that
   * _extends_ the original props type.
   */
  props<TNewProps extends Partial<TProps> & Record<string, any>>(options: {
    extend: true;
  }): IStyledTemplateMod<TStatic, Flat<TProps & TNewProps>, TProps, Flat<TProps & TNewProps>>;
}

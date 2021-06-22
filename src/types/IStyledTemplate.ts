import { IStyledTemplateBase } from './IStyledTemplateBase';
import { Id } from './Utilities';

export interface IStyledTemplate<TSelector extends boolean, TProps> extends IStyledTemplateBase<TSelector, TProps> {
  /**
   * Change the styled component props type to new type that is
   * assignable to the original props type.
   */
  props<TNewProps extends Partial<TProps> & Record<string, any>>(): IStyledTemplateBase<
    TSelector,
    Id<TNewProps>,
    TProps,
    Id<TNewProps>
  >;
  /**
   * Change the styled component props type and provide a mapping
   * function to the convert the new type to the wrapped component's
   * props type.
   */
  props<TNewOuterProps, TNewInnerProps extends Partial<TProps> & Record<string, any>>(
    cb: (props: TNewOuterProps) => Partial<TProps> & TNewInnerProps,
  ): IStyledTemplateBase<TSelector, Id<TNewOuterProps>, TProps, Id<TNewInnerProps>>;
}

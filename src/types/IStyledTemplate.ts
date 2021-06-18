import { IStyledTemplateBase } from './IStyledTemplateBase';
import { Id } from './Utilities';

export interface IStyledTemplate<TProps> extends IStyledTemplateBase<TProps> {
  /**
   * Change the styled component props type to new type that is still
   * assignable to the original props type.
   */
  props<TNewProps extends Partial<TProps> & Record<string, any>>(): IStyledTemplateBase<
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
  ): IStyledTemplateBase<Id<TNewOuterProps>, TProps, Id<TNewInnerProps>>;
}

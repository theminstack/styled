import { IStyledComponent } from './IStyledComponent';
import { IStyledSelector } from './IStyledSelector';
import { StyleValue } from './StyleValue';
import { Defaults, Id, Merge } from './Utilities';

export interface IStyledTemplateBase<
  TSelector extends boolean,
  TOuterProps,
  TInnerProps = TOuterProps,
  TExtendedProps = TInnerProps,
> {
  (template: TemplateStringsArray, ...values: StyleValue<TExtendedProps>[]): (TSelector extends true
    ? IStyledSelector
    : unknown) &
    IStyledComponent<TOuterProps>;

  /**
   * Use prop default values. As the name implies, this callback is
   * generally where you should use hooks (eg. `useTheme()`).
   *
   * - If you want to set prop values regardless of the current
   * value, try the {@link StyledTemplateBase.set set} method.
   * - If you want to set _and_ remove values, try the
   * {@link StyledTemplateBase.map map} method.
   */
  use<TNewInnerProps extends Partial<TInnerProps> & Record<string, any>>(
    cb: (props: TExtendedProps) => Partial<TInnerProps> & TNewInnerProps,
  ): IStyledTemplateBase<TSelector, TOuterProps, TInnerProps, Defaults<[TExtendedProps, TNewInnerProps]>>;

  /**
   * Partially set props. This is effectively a "merge" with
   * undefined value skipping.
   *
   * _Be careful that you do not **unconditionally** overwrite
   * properties passed in to the styled component!_
   *
   * - If you want to provide default prop values (when the current
   * value is undefined), try the {@link StyledTemplateBase.use use}
   * method.
   * - If you want to set _and_ remove values, try the
   * {@link StyledTemplateBase.map map} method.
   */
  set<TNewInnerProps extends Partial<TInnerProps> & Record<string, any>>(
    cb: (props: TExtendedProps) => Partial<TInnerProps> & TNewInnerProps,
  ): IStyledTemplateBase<TSelector, TOuterProps, TInnerProps, Merge<[TExtendedProps, TNewInnerProps]>>;

  /**
   * Transform all props based on previous props. The new props must
   * still be compatible with the wrapped component's props.
   *
   * _This method **removes** props that are not returned._
   *
   * - If you want to provide default prop values, try the
   * {@link StyledTemplateBase.use use} method.
   * - If you want to set (not remove) some prop values, try
   * the {@link StyledTemplateBase.set set} method.
   */
  map<TNewInnerProps extends Partial<TInnerProps> & Record<string, any>>(
    cb: (props: TExtendedProps) => Partial<TInnerProps> & TNewInnerProps,
  ): IStyledTemplateBase<TSelector, TOuterProps, TInnerProps, Id<TNewInnerProps>>;
}

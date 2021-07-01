import { IStyledComponent } from './IStyledComponent';
import { StyleValue } from './StyleValue';
import { Defaults, Flat, Merge } from './Utilities';

/**
 * Styled template function with static utility methods for modifying
 * the styled component's prop values.
 */
export interface IStyledTemplateMod<
  TStatic extends {},
  TOuterProps extends {},
  TInnerProps extends {} = TOuterProps,
  TExtendedProps extends {} = TInnerProps,
> {
  /**
   * Styled tagged template function.
   */
  (template: TemplateStringsArray, ...values: StyleValue<TExtendedProps>[]): IStyledComponent<
    TOuterProps,
    TInnerProps
  > &
    TStatic;

  /**
   * Use prop default values. As the name implies, this callback is
   * generally where you should use hooks (eg. `useTheme()`).
   *
   * - Try the {@link IStyledTemplate.set set} method if you want to
   * set prop values regardless of the current value.
   * - Try the {@link IStyledTemplate.map map} method if you want to
   * set _and_ remove values.
   */
  use<TNewInnerProps extends Partial<TInnerProps> & Record<string, any>>(
    cb: (props: TExtendedProps) => TNewInnerProps,
  ): IStyledTemplateMod<TStatic, TOuterProps, TInnerProps, Flat<Defaults<TExtendedProps, TNewInnerProps>>>;

  /**
   * Partially set props. This is effectively a "merge" with
   * undefined value skipping.
   *
   * _Be careful that you do not **unconditionally** overwrite props
   * passed in to the styled component!_
   *
   * - Try the {@link IStyledTemplate.use use} method if you want to
   * provide default prop values (when the current value is
   * undefined).
   * - Try the {@link IStyledTemplate.map map} method if you want to
   * set _and_ remove values.
   */
  set<TNewInnerProps extends Partial<TInnerProps> & Record<string, any>>(
    cb: (props: TExtendedProps) => TNewInnerProps,
  ): IStyledTemplateMod<TStatic, TOuterProps, TInnerProps, Flat<Merge<TExtendedProps, TNewInnerProps>>>;

  /**
   * Transform all props based on previous props. The new props must
   * still be compatible with the wrapped component's props.
   *
   * _This method **removes** props that are not returned._
   *
   * - Try the {@link IStyledTemplate.use use} method if you want to
   * provide default prop values.
   * - Try the {@link IStyledTemplate.set set} method if you want to
   * set (not remove) some prop values.
   */
  map<TNewInnerProps extends TInnerProps & Record<string, any>>(
    cb: (props: TExtendedProps) => TNewInnerProps,
  ): IStyledTemplateMod<TStatic, TOuterProps, TInnerProps, Flat<TNewInnerProps>>;
}

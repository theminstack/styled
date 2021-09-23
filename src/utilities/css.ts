import { Resolve } from './Resolve';

type StyledMixin<TProps extends Record<string, unknown>> = {} extends TProps
  ? (props?: TProps) => string
  : (props: TProps) => string;

export type StyledTemplateProps<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined = undefined,
> = Resolve<TTheme extends undefined ? TProps : Omit<TProps, 'theme'> & { theme: TTheme }>;

export type StyledTemplateValues<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined = undefined,
> = (
  | string
  | number
  | null
  | undefined
  | ((props: StyledTemplateProps<TProps, TTheme>) => string | number | null | undefined)
)[];

/**
 * Create a style helper (AKA: mixin) function.
 *
 * ```tsx
 * const helperFunction = css``;
 * const helperFunction = css<Props>``;
 * ```
 */
export function css<TProps extends Record<string, unknown>>(
  template: TemplateStringsArray,
  ...values: StyledTemplateValues<TProps>
): StyledMixin<TProps> {
  return (props = {}) => {
    let styleString = '';

    for (let i = template.raw.length - 1; i >= 0; --i) {
      let value = values[i];

      if (typeof value === 'function') {
        value = value(props as TProps);
      }

      styleString = template.raw[i] + (value == null ? '' : value) + styleString;
    }

    return styleString;
  };
}

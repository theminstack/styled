import { getStyleText } from './utils/getStyleText';
import { StyleHelper } from './types/StyleHelper';
import { StyleValue } from './types/StyleValue';
import { StylePrimitive } from './types/StylePrimitive';
import { IStyledSelector } from './types/IStyledSelector';
import { isStyledSelector } from './utils/isStyledSelector';

/**
 * Syntax helper for static style strings.
 *
 * ```ts
 * const styleText = css`
 *   color: red;
 * `;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function css<TProps = unknown>(
  template: TemplateStringsArray,
  ...values: (StylePrimitive | IStyledSelector)[]
): string;
/**
 * Create a style helper function which may accept props and returns
 * style text.
 *
 * ```ts
 * const helper = css<{ color?: string }>`
 *   color: ${(props) => props.color};
 * `;
 *
 * const Foo = styled('div')`
 *   ${helper({ color: 'blue' })}
 * `;
 * ```
 */
export function css<TProps = unknown>(
  template: TemplateStringsArray,
  ...values: StyleValue<TProps>[]
): StyleHelper<TProps>;
export function css<TProps = unknown>(
  template: TemplateStringsArray,
  ...values: StyleValue<TProps>[]
): string | StyleHelper<TProps> {
  return values.every((value) => typeof value !== 'function' || isStyledSelector(value))
    ? getStyleText(template, values, {})
    : (((props: Record<string, unknown> = {}): string => getStyleText(template, values, props)) as StyleHelper<TProps>);
}

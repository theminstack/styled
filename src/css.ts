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
 *
 * **NOTE**: Style partials should be complete styles. This means
 * that you should terminate all your statements with semicolons,
 * and close all your blocks.
 *
 * ```ts
 * // good
 * css`color: red;`;
 * css`
 *   &:hover {
 *     color: blue;
 *   }
 * `;
 *
 * // bad
 * css`red`; // not a statement, only a value.
 * css`color: red`; // no terminating semicolon.
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function css<TProps = {}>(
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
 *
 * **NOTE**: Style partials should be complete styles. This means
 * that you should terminate all your statements with semicolons,
 * and close all your blocks.
 *
 * ```ts
 * // good
 * css<{ color: string }>`color: ${(props) => props.color};`;
 * css<{ color: string }>`
 *   &:hover {
 *     color: ${(props) => props.color};
 *   }
 * `;
 *
 * // bad
 * css<{ color: string }>`${(props) => props.color}`; // not a statement, only a value.
 * css<{ color: string }>`color: ${(props) => props.color}`; // no terminating semicolon.
 * ```
 */
export function css<TProps = {}>(template: TemplateStringsArray, ...values: StyleValue<TProps>[]): StyleHelper<TProps>;
export function css<TProps = {}>(
  template: TemplateStringsArray,
  ...values: StyleValue<TProps>[]
): string | StyleHelper<TProps> {
  return values.every((value) => typeof value !== 'function' || isStyledSelector(value))
    ? getStyleText(template, values, {})
    : (((props: Record<string, unknown> = {}): string => getStyleText(template, values, props)) as StyleHelper<TProps>);
}

import { StyleValue } from './types/StyleValue';
import { getStyleText } from './utils/getStyleText';

/**
 * Create a style helper function which may accept properties and
 * returns style text.
 *
 * ```ts
 * const shadow = css<{ color?: string }>`
 *   box-shadow: 5px 5px 10px ${(props) => props.color ?? 'black'};
 * `;
 * ```
 */
export function css<TProps extends Record<string, unknown> = {}>(
  template: TemplateStringsArray,
  ...values: StyleValue<TProps>[]
): {} extends TProps ? (props?: TProps) => string : (props: TProps) => string {
  return (props: Record<string, unknown> = {}) => getStyleText(template, values, props);
}

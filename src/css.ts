import { getStyleText } from './utils/getStyleText';
import { StyleHelper } from './types/StyleHelper';
import { StyleValue } from './types/StyleValue';

/**
 * Create a style helper function which may accept props and returns
 * style text.
 *
 * ```ts
 * const shadow = css<{ color?: string }>`
 *   box-shadow: 5px 5px 10px ${(props) => props.color ?? 'black'};
 * `;
 *
 * const Foo = styled('div')`
 *   ${shadow({ color: 'blue' })}
 * `;
 * ```
 */
export function css<TProps extends Record<string, unknown> = {}>(
  template: TemplateStringsArray,
  ...values: StyleValue<TProps>[]
): StyleHelper<TProps> {
  return ((props: Record<string, unknown> = {}): string =>
    getStyleText(template, values, props)) as StyleHelper<TProps>;
}

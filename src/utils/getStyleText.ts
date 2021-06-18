import { isStyledComponent } from './isStyledComponent';

/**
 * Convert a tagged template array and values into a single style
 * string with all function values resolved. Styled component
 * values are resolved to their ID class selector string. Other
 * functions are invoked with the props object and the return value
 * is used as the final template value.
 */
export function getStyleText(template: TemplateStringsArray, values: unknown[], props: {} = {}): string {
  return String.raw(
    template,
    ...values.map((value) =>
      typeof value == null ? '' : typeof value === 'function' && !isStyledComponent(value) ? value(props) : value,
    ),
  );
}

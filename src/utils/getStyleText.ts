import { isStyledSelector } from './isStyledSelector';

/**
 * Convert a tagged template array and values into a single style
 * string with all function values resolved.
 */
export function getStyleText(template: TemplateStringsArray, values: unknown[], props: unknown): string {
  return template.raw
    .reduce<string[]>((acc, segment, i) => {
      acc.push(segment);

      if (i < values.length) {
        const value = values[i];

        acc.push(
          typeof value == null ? '' : typeof value === 'function' && !isStyledSelector(value) ? value(props) : value,
        );
      }

      return acc;
    }, [])
    .join('');
}

/**
 * Normalize a string so that it's safe to use as a CSS identifier
 * (eg. class name).
 *
 * https://www.w3.org/TR/CSS21/syndata.html#characters
 */
export function getCssIdentifier(value: string): string {
  return value
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/(^[-_]*|[-_]*$)/g, '')
    .replace(/^(?=\d)/g, '_');
}

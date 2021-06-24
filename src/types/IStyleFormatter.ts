/**
 * A style formatter controls how CSS is formatted for style element
 * text content.
 *
 * Using a custom style formatter may be useful useful for minifying
 * or auto-prefixing CSS text.
 */
export interface IStyleFormatter {
  /**
   * Return an indented CSS prop string. The key will be null
   * for at-rules (`@`).
   */
  property(indent: string, key: string | null, values: string[]): string;
  /**
   * Return an indented block opening with the given conditions.
   */
  openBlock(indent: string, conditions: string[]): string;
  /**
   * Return an indented block closing.
   */
  closeBlock(indent: string): string;
}

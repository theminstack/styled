import { IStyleFormatter } from './types/IStyleFormatter';

/**
 * Default CSS formatter.
 */
export class DefaultStyleFormatter implements IStyleFormatter {
  property(indent: string, key: string, values: string[]): string {
    return indent + (key ? key + ': ' : '') + values.join(', ') + ';\n';
  }

  openBlock(indent: string, conditions: string[]): string {
    return indent + conditions.join(',\n' + indent) + ' {\n';
  }

  closeBlock(indent: string): string {
    return indent + '}\n';
  }
}

/**
 * Singleton instance of the `DefaultStyleFormatter` class.
 */
export const defaultStyleFormatter = new DefaultStyleFormatter();

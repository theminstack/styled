// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Styled } from './styled';

type StyleTemplateDynamicValue<TProps extends {}, TArgs extends readonly unknown[] = []> = (
  props: TProps,
  ...args: TArgs
) => string | number | null | undefined | { toString: () => string };

/**
 * Values provided as part of a {@link Styled styled} template string.
 */
type StyleTemplateValues<TProps extends {}, TArgs extends readonly unknown[] = []> = (
  | string
  | number
  | null
  | undefined
  | { toString: () => string }
  | StyleTemplateDynamicValue<TProps, TArgs>
)[];

interface Style<TProps extends {}, TArgs extends unknown[] = []> {
  extend: <TExtendedProps extends TProps, TExtendedArgs extends TArgs>(
    style: Style<TExtendedProps, TExtendedArgs>,
  ) => Style<TExtendedProps, TExtendedArgs>;

  getString: (props: TProps, ...args: TArgs) => string;
}

function getSimplifiedTemplate<TProps extends {}, TArgs extends unknown[] = []>(
  templateRaw: readonly string[],
  templateValues: StyleTemplateValues<TProps, TArgs>,
): [template: readonly string[], values: StyleTemplateDynamicValue<TProps, TArgs>[]] {
  const strings: string[] = [];
  const values: StyleTemplateDynamicValue<TProps, TArgs>[] = [];

  let buffer = templateRaw[templateRaw.length - 1];

  for (let i = templateValues.length - 1; i >= 0; i--) {
    const string = templateRaw[i];
    const value = templateValues[i];

    if (typeof value === 'function') {
      strings.unshift(buffer);
      values.unshift(value as StyleTemplateDynamicValue<TProps, TArgs>);
      buffer = string;
    } else {
      buffer = string + value + buffer;
    }
  }

  strings.unshift(buffer);

  return [strings, values];
}

function createCompoundStyle<TProps extends {}, TArgs extends unknown[] = []>(
  ...styles: Style<TProps, TArgs>[]
): Style<TProps, TArgs> {
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let str = '';

      for (let i = styles.length - 1; i >= 0; i--) {
        str = styles[i].getString(props, ...args) + '\n' + str;
      }

      return str;
    },
  };

  return style;
}

function createStyle<TProps extends {}, TArgs extends unknown[] = []>(
  template: TemplateStringsArray,
  templateValues: StyleTemplateValues<TProps, TArgs>,
): Style<TProps, TArgs> {
  const [strings, values] = getSimplifiedTemplate(template.raw, templateValues);
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let styleString = strings[strings.length - 1];

      for (let i = values.length - 1; i >= 0; --i) {
        styleString = strings[i] + values[i](props, ...args) + styleString;
      }

      return styleString;
    },
  };

  return style;
}

export { type Style, type StyleTemplateValues, createStyle };

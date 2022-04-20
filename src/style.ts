// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Styled } from './styled';

type StyleTemplateDynamicValue<TProps extends {}, TArgs extends readonly unknown[] = readonly []> = (
  props: TProps,
  ...args: TArgs
) => number | string | { readonly toString: () => string } | null | undefined;

/**
 * Values provided as part of a {@link Styled styled} template string.
 */
type StyleTemplateValues<TProps extends {}, TArgs extends readonly unknown[] = readonly []> = readonly (
  | StyleTemplateDynamicValue<TProps, TArgs>
  | number
  | string
  | { readonly toString: () => string }
  | null
  | undefined
)[];

type Style<TProps extends {}, TArgs extends readonly unknown[] = readonly []> = {
  readonly extend: <TExtendedProps extends TProps, TExtendedArgs extends TArgs>(
    style: Style<TExtendedProps, TExtendedArgs>,
  ) => Style<TExtendedProps, TExtendedArgs>;

  readonly getString: (props: TProps, ...args: TArgs) => string;
};

const getSimplifiedTemplate = <TProps extends {}, TArgs extends readonly unknown[] = readonly []>(
  templateRaw: readonly string[],
  templateValues: StyleTemplateValues<TProps, TArgs>,
): readonly [template: readonly string[], values: readonly StyleTemplateDynamicValue<TProps, TArgs>[]] => {
  const strings: string[] = [];
  const values: StyleTemplateDynamicValue<TProps, TArgs>[] = [];

  let buffer = templateRaw[templateRaw.length - 1];

  for (let index = templateValues.length - 1; index >= 0; index--) {
    const string = templateRaw[index];
    const value = templateValues[index];

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
};

const createCompoundStyle = <TProps extends {}, TArgs extends readonly unknown[] = readonly []>(
  ...styles: readonly Style<TProps, TArgs>[]
): Style<TProps, TArgs> => {
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let str = '';

      for (let index = styles.length - 1; index >= 0; index--) {
        str = styles[index].getString(props, ...args) + '\n' + str;
      }

      return str;
    },
  };

  return style;
};

const createStyle = <TProps extends {}, TArgs extends readonly unknown[] = readonly []>(
  template: TemplateStringsArray,
  templateValues: StyleTemplateValues<TProps, TArgs>,
): Style<TProps, TArgs> => {
  const [strings, values] = getSimplifiedTemplate(template.raw, templateValues);
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let styleString = strings[strings.length - 1];

      for (let index = values.length - 1; index >= 0; --index) {
        styleString = strings[index] + values[index](props, ...args) + styleString;
      }

      return styleString;
    },
  };

  return style;
};

export { type Style, type StyleTemplateValues, createStyle };

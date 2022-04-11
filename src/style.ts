type StyleTemplateValues<TProps extends {}, TArgs extends readonly unknown[] = []> = (
  | string
  | number
  | null
  | undefined
  | ((props: TProps, ...args: TArgs) => string | number | null | undefined)
)[];

interface Style<TProps extends {}, TArgs extends unknown[] = []> {
  extend: <TExtendedProps extends TProps, TExtendedArgs extends TArgs>(
    style: Style<TExtendedProps, TExtendedArgs>,
  ) => Style<TExtendedProps, TExtendedArgs>;

  getString: (props: TProps, ...args: TArgs) => string;
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
  values: StyleTemplateValues<TProps, TArgs>,
): Style<TProps, TArgs> {
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let styleString = '';

      for (let i = template.raw.length - 1; i >= 0; --i) {
        let value = values[i];

        if (typeof value === 'function') {
          value = value(props, ...args);
        }

        styleString = template.raw[i] + (value == null ? '' : value) + styleString;
      }

      return styleString;
    },
  };

  return style;
}

export { type Style, type StyleTemplateValues, createStyle };

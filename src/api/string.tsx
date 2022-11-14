type StyledStringSelectable = { readonly $$rms: unknown };

type StyledStringPrimitive = StyledStringSelectable | number | string | false | null | undefined;

type StyledStringCallback<TProps extends {}, TTheme extends {}> = (
  props: TProps,
  theme: TTheme,
) => number | string | false | null | undefined;

type StyledStringValue<TProps extends {}, TTheme extends {}> =
  | StyledStringCallback<TProps, TTheme>
  | StyledStringPrimitive;

type StyledStringHook<TProps extends {}> = (props: TProps) => string;

type StyledString = (template: TemplateStringsArray | readonly string[], ...values: StyledStringPrimitive[]) => string;

const isPrimitives = (values: StyledStringValue<any, any>[]): values is StyledStringPrimitive[] =>
  values.every((value) => typeof value !== 'function');

const getPrimitives = <TProps extends {}, TTheme extends {}>(
  values: StyledStringValue<TProps, TTheme>[],
  props: TProps,
  theme: TTheme,
): StyledStringPrimitive[] =>
  values.map((value): StyledStringPrimitive => {
    return typeof value === 'function'
      ? value(props, theme)
      : typeof value === 'object' && value != null
      ? value.toString()
      : value;
  });

const getStyleStringHook = <TProps extends {}, TTheme extends {}>(
  raw: readonly string[],
  values: StyledStringValue<TProps, TTheme>[],
  useTheme: () => TTheme,
): StyledStringHook<TProps> => {
  if (isPrimitives(values)) {
    const staticString = string(raw, ...values);
    return () => staticString;
  }

  return (props) => {
    const theme = useTheme();
    return string(raw, ...getPrimitives(values, props, theme));
  };
};

const string: StyledString = (template, ...values) =>
  ('raw' in template ? template.raw : template)
    .reduce((result, str, i) => {
      const value = values[i];
      return result + str + (!value && typeof value !== 'number' ? '' : value);
    }, '')
    .replaceAll('\0', '');

export { type StyledString, type StyledStringSelectable, type StyledStringValue, getStyleStringHook, string };

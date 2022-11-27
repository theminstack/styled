type StyledStringSelectable = { readonly $$rms: any };

type StyledStringPrimitive = StyledStringSelectable | number | string | false | null | undefined;

type StyledStringCallback<TProps, TTheme> = (props: TProps, theme: TTheme) => StyledStringPrimitive;

type StyledStringValue<TProps, TTheme> = StyledStringCallback<TProps, TTheme> | StyledStringPrimitive;

type StyledStringHook<TProps> = (props: TProps) => string;

type StyledString = (
  template: TemplateStringsArray | readonly string[],
  ...values: readonly StyledStringPrimitive[]
) => string;

const isPrimitive = (value: StyledStringValue<any, any>): value is StyledStringPrimitive => {
  return ((typeof value !== 'object' || value === null) && typeof value !== 'function') || '$$rms' in value;
};

const isStaticTemplateData = (data: readonly (StyledStringCallback<any, any> | string)[]): data is [string] => {
  return data.length === 1 && typeof data[0] === 'string';
};

const getSimplifiedTemplateData = <TProps, TTheme>(
  raw: readonly string[],
  values: readonly StyledStringValue<TProps, TTheme>[],
) => {
  const data: (StyledStringCallback<TProps, TTheme> | string)[] = [];

  let buffer = '';

  raw.forEach((s, i) => {
    const value = values[i];
    buffer += s;
    if (isPrimitive(value)) {
      if (value != null && value !== false) buffer += value;
    } else {
      data.push(buffer, value);
      buffer = '';
    }
  });

  if (buffer) data.push(buffer);

  return data;
};

const getStyleStringHook = <TProps, TTheme>(
  data: (StyledStringCallback<TProps, TTheme> | string)[],
  useTheme: () => TTheme,
): StyledStringHook<TProps> => {
  if (isStaticTemplateData(data)) {
    const value = data[0];
    return () => value;
  }

  return (props) => {
    const theme = useTheme();
    return data.reduce<string>(
      (result, value) => result + (typeof value === 'string' ? value : value(props, theme)),
      '',
    );
  };
};

const string: StyledString = (template, ...values) =>
  ('raw' in template ? template.raw : template).reduce((result, str, i) => {
    const value = values[i];
    return result + str + (!value && typeof value !== 'number' ? '' : value);
  }, '');

export {
  type StyledString,
  type StyledStringCallback,
  type StyledStringPrimitive,
  type StyledStringSelectable,
  type StyledStringValue,
  getSimplifiedTemplateData,
  getStyleStringHook,
  string,
};

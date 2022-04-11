export function getHtmlAttributes<TProps extends {}>(props: TProps): Partial<TProps> {
  const keys = Object.keys(props) as Array<keyof TProps & string>;
  const filtered: Partial<TProps> = {};

  for (let i = keys.length - 1; i >= 0; --i) {
    const key = keys[i];

    if (key[0] !== '$') {
      filtered[key] = props[key];
    }
  }

  return filtered;
}

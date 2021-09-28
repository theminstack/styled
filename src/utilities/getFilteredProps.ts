export function getFilteredProps(props: Record<string, unknown>): Record<string, unknown> {
  const keys = Object.keys(props);
  const filtered: Record<string, unknown> = {};

  for (let i = keys.length - 1; i >= 0; --i) {
    const key = keys[i];

    if (key[0] !== '$') {
      filtered[key] = props[key];
    }
  }

  return filtered;
}

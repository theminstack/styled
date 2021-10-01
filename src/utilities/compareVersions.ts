function getVersionValue(version: string) {
  const [, numbers = '', tag = ''] = version.match(/(\d+(?:\.\d+){0,2})(-.*)?/) ?? [];

  return (
    numbers.split(/\./g).reduce((acc, value, i) => acc + (Number.parseInt(value, 10) || 0) * Math.pow(1000, 2 - i), 0) *
      10 +
    (tag ? 1 : 0)
  );
}

export function compareVersions(a: string, b: string): number {
  const a0 = getVersionValue(a);
  const b0 = getVersionValue(b);
  const diff = a0 - b0;

  return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}

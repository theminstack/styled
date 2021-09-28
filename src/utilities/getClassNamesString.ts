export function getClassNamesString(...classNames: unknown[]): string {
  let result = '';

  for (let i = classNames.length - 1; i >= 0; --i) {
    const className = classNames[i];

    if (typeof className === 'string' && className) {
      result = result ? className + ' ' + result : className;
    }
  }

  return result;
}

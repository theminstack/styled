export function getDisplayName(component: string | {} | { displayName?: string; name?: string }): string {
  return (
    '$$tss(' +
    (typeof component === 'string'
      ? component
      : ('displayName' in component && component.displayName) || ('name' in component && component.name) || 'unknown') +
    ')'
  );
}

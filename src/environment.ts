declare const process: { env: Record<string, string> } | undefined;

interface Environment {
  readonly isTest: boolean;
  readonly isBrowser: boolean;
}

const environment: Environment = {
  isBrowser: typeof document !== 'undefined',
  isTest: typeof process !== 'undefined' && process.env.NODE_ENV === 'test',
};

export { environment };

const isBrowser = typeof document !== 'undefined';

const processEnvironment = typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined;
const environment = processEnvironment || 'production';

export { environment, isBrowser };

import schemaBenchmarkConfig, { BenchmarkConfig } from '../types/schemaBenchmarkConfig';

const context = require.context('.', true, /\/.+\/index\.tsx?$/);

export default context.keys().reduce<Record<string, BenchmarkConfig>>((acc, key) => {
  const value = schemaBenchmarkConfig.parse(context(key));
  return { ...acc, [value.name]: value };
}, {});

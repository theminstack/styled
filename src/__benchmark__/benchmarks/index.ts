import { type BenchmarkConfig, schemaBenchmarkConfig } from '../types/schema-benchmark-config';

const context = require.context('.', true, /\/.+\/index\.tsx?$/);

export const benchmarks = context.keys().reduce<Record<string, BenchmarkConfig>>((acc, key) => {
  const value = schemaBenchmarkConfig.parse(context(key));
  return { ...acc, [value.name]: value };
}, {});

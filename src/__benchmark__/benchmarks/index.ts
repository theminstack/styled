import { type BenchmarkConfig } from '../types/benchmark-config';
import * as mountDeep from './mount-deep';
import * as mountWide from './mount-wide';
import * as updateStyles from './update-styles';

export const benchmarks: Record<string, BenchmarkConfig> = {
  [mountDeep.name]: mountDeep,
  [mountWide.name]: mountWide,
  [updateStyles.name]: updateStyles,
};

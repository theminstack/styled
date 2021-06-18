import { Tokens } from './types/Tokens';

export const styleCache = Object.create(null) as Record<string, Tokens>;
export const idCounters = Object.create(null) as Record<string, number>;

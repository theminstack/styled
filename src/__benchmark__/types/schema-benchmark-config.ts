import { type ReactElement, isValidElement } from 'react';
import { z } from 'zod';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';
import { schemaElementType } from './schema-element-type';

const schemaElement = z.custom<ReactElement>((value) => typeof value === 'object' && isValidElement(value));
const schemaBenchmarkType = z.enum(['mount', 'unmount', 'update']);
const schemaBenchmarkComponents = z.object({
  Dot: schemaElementType<DotProps>(),
  Box: schemaElementType<BoxProps>(),
});
const schemaBenchmarkRender = z.function(z.tuple([schemaBenchmarkComponents, z.number()]), schemaElement);

export const schemaBenchmarkConfig = z.object({
  name: z.string(),
  type: schemaBenchmarkType,
  render: schemaBenchmarkRender,
  timeout: z.number().optional(),
  sampleCount: z.number().optional(),
});

export type BenchmarkConfig = z.infer<typeof schemaBenchmarkConfig>;
export type BenchmarkType = z.infer<typeof schemaBenchmarkType>;
export type BenchmarkComponents = z.infer<typeof schemaBenchmarkComponents>;
export type BenchmarkRender = z.infer<typeof schemaBenchmarkRender>;

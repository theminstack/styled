import { isValidElement, ReactElement } from 'react';
import { z } from 'zod';
import { IBoxProps } from './IBoxProps';
import { IDotProps } from './IDotProps';
import schemaElementType from './schemaElementType';

const schemaElement = z.custom<ReactElement>((value) => typeof value === 'object' && isValidElement(value));
const schemaBenchmarkType = z.enum(['mount', 'unmount', 'update']);
const schemaBenchmarkComponents = z.object({
  Dot: schemaElementType<IDotProps>(),
  Box: schemaElementType<IBoxProps>(),
});
const schemaBenchmarkRender = z.function(z.tuple([schemaBenchmarkComponents, z.number()]), schemaElement);
const schemaBenchmarkConfig = z.object({
  name: z.string(),
  type: schemaBenchmarkType,
  render: schemaBenchmarkRender,
  timeout: z.number().optional(),
  sampleCount: z.number().optional(),
});

export default schemaBenchmarkConfig;
export type BenchmarkConfig = z.infer<typeof schemaBenchmarkConfig>;
export type BenchmarkType = z.infer<typeof schemaBenchmarkType>;
export type BenchmarkComponents = z.infer<typeof schemaBenchmarkComponents>;
export type BenchmarkRender = z.infer<typeof schemaBenchmarkRender>;

import { z } from 'zod';

import { type BoxProps } from './box-props';
import { type DotProps } from './dot-props';
import { schemaElementType } from './schema-element-type';

export const schemaLibraryConfig = z.object({
  name: z.string(),
  Dot: schemaElementType<DotProps>(),
  Box: schemaElementType<BoxProps>(),
});

export type LibraryConfig = z.infer<typeof schemaLibraryConfig>;

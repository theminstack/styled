import { z } from 'zod';
import { IBoxProps } from './IBoxProps';
import { IDotProps } from './IDotProps';
import schemaElementType from './schemaElementType';

const schemaLibraryConfig = z.object({
  name: z.string(),
  Dot: schemaElementType<IDotProps>(),
  Box: schemaElementType<IBoxProps>(),
});

export default schemaLibraryConfig;
export type LibraryConfig = z.infer<typeof schemaLibraryConfig>;

import { ElementType } from 'react';
import { isValidElementType } from 'react-is';
import { z } from 'zod';

export const schemaElementType = <T = any>(): z.ZodType<ElementType<T>> =>
  z.custom((value) => isValidElementType(value));

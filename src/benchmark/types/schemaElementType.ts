import { ElementType } from 'react';
import { z } from 'zod';
import { isValidElementType } from 'react-is';

const schemaElementType = <T = any>(): z.ZodType<ElementType<T>> => z.custom((value) => isValidElementType(value));

export default schemaElementType;

import { StylePrimitive } from './StylePrimitive';
import { StylePrimitiveFactory } from './StylePrimitiveFactory';
import { IStyledComponentStatic } from './IStyledComponentStatic';

export type StyleValue<TProps> = StylePrimitive | StylePrimitiveFactory<TProps> | IStyledComponentStatic;

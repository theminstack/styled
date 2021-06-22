import { StylePrimitive } from './StylePrimitive';
import { StylePrimitiveFactory } from './StylePrimitiveFactory';
import { IStyledSelector } from './IStyledSelector';

export type StyleValue<TProps> = StylePrimitive | StylePrimitiveFactory<TProps> | IStyledSelector;

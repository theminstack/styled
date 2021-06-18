import { StylePrimitive } from './StylePrimitive';

export type StylePrimitiveFactory<TProps> = (props: TProps) => StylePrimitive;

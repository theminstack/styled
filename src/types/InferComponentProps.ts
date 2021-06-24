import { Flat } from './Utilities';

export type InferComponentProps<T> = T extends new (props: infer P) => any
  ? Flat<P>
  : T extends (props: infer P) => any
  ? Flat<P>
  : unknown;

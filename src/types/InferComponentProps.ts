import { Id } from './Utilities';

export type InferComponentProps<T> = T extends new (props: infer P) => any
  ? Id<P>
  : T extends (props: infer P) => any
  ? Id<P>
  : unknown;

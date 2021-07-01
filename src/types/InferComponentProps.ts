import { Flat } from './Utilities';

export type InferComponentProps<T> = T extends new (props: infer P) => unknown
  ? Flat<P extends {} ? P : {}>
  : T extends (props: infer P) => unknown
  ? Flat<P extends {} ? P : {}>
  : {};

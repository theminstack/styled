import { IStylableComponentProps } from './IStylableComponentProps';

export type StylableComponent<TProps extends IStylableComponentProps> =
  | (new (props: TProps) => any)
  | ((props: TProps) => any);

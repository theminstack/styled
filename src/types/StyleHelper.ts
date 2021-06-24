export type StyleHelper<TProps> = {} extends TProps ? (props?: TProps) => string : (props: TProps) => string;

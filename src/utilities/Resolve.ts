export type Resolve<TProps> = any extends any ? { [P in keyof TProps]: TProps[P] } : never;

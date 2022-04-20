type Stylesheet = {
  readonly cssString: string;
  readonly data: string;
  readonly mount?: () => void;
  readonly unmount?: () => void;
  readonly update: (cssString: string, data: string) => Stylesheet;
};

export type { Stylesheet };

interface Stylesheet {
  readonly cssString: string;
  readonly data: string;
  update: (cssString: string, data: string) => Stylesheet;
  mount?: () => void;
  unmount?: () => void;
}

export type { Stylesheet };

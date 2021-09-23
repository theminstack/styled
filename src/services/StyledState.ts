type PartialElement<TElement extends PartialElement<any> = PartialElement<any>> = {
  insertAdjacentElement(where: 'beforebegin' | 'beforeend' | 'afterend', element: TElement): void;
};

export type StyledState = {
  readonly headStyle: { value?: PartialElement };
  prevStyle?: PartialElement;
  styleStringToClassNameMap: Map<string, string>;
};

let prevState: StyledState = {
  headStyle: {},
  styleStringToClassNameMap: new Map(),
};

export function createStyledState(): StyledState {
  return (prevState = Object.assign(Object.create(prevState), {
    styleStringToClassNameMap: new Map(),
  }));
}

export function resetStyledStates(): void {
  delete prevState.headStyle.value;

  for (let current = prevState; 'headStyle' in current; current = Object.getPrototypeOf(current)) {
    delete current.prevStyle;
    current.styleStringToClassNameMap = new Map();
  }
}

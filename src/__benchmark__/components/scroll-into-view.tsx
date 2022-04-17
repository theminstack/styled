import { type ReactElement, useEffect, useRef } from 'react';

function ScrollIntoView(): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), []);

  return <div ref={ref} />;
}

export { ScrollIntoView };

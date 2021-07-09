import React, { ReactElement, useEffect, useRef } from 'react';

export default function ScrollIntoView(): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), []);

  return <div ref={ref} />;
}

import { useEffect, useState } from 'react';

export function useViewHeight(): string {
  const [value, setValue] = useState('1vh');

  useEffect(() => {
    const onResize = () => setValue(`${window.innerHeight * 0.01}px`);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return value;
}

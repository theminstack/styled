import { useEffect, useState } from 'react';

const useViewHeight = (): string => {
  const [value, setValue] = useState('100vh');

  useEffect(() => {
    const onResize = () => setValue(`${window.innerHeight * 0.01}px`);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return value;
};

export { useViewHeight };

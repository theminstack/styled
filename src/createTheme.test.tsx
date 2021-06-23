import React from 'react';
import { render } from '@testing-library/react';
import { createTheme } from './createTheme';

test('createTheme', () => {
  const [useTheme, Theme] = createTheme({
    color: 'white',
    background: 'black',
  });
  const A = () => {
    const theme = useTheme();
    return <div>{JSON.stringify(theme)}</div>;
  };

  const { container } = render(
    <>
      <A />
      <Theme value={{ color: 'blue', background: 'gray' }}>
        <A />
        <Theme value={(theme) => ({ ...theme, color: 'red' })}>
          <A />
        </Theme>
      </Theme>
    </>,
  );
  expect(container).toMatchInlineSnapshot(`
<div>
  <div>
    {"color":"white","background":"black"}
  </div>
  <div>
    {"color":"blue","background":"gray"}
  </div>
  <div>
    {"color":"red","background":"gray"}
  </div>
</div>
`);
});

import { type FC } from 'react';

import { type BoxProps } from '../../types/box-props';
import { View } from './view';

export const Box: FC<BoxProps> = ({ $layout, $outer = false, $fixed = false, $color, children }) => {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: $color,
        flexDirection: $layout === 'column' ? 'column' : 'row',
        height: $fixed ? '6px' : undefined,
        padding: $outer ? '4px' : 0,
        width: $fixed ? '6px' : undefined,
      }}
    >
      {children}
    </View>
  );
};

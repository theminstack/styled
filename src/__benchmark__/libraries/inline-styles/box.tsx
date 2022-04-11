import { type FC } from 'react';

import { type BoxProps } from '../../types/box-props';
import { View } from './view';

export const Box: FC<BoxProps> = ({ $layout, $outer = false, $fixed = false, $color, children }) => {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: $layout === 'column' ? 'column' : 'row',
        padding: $outer ? '4px' : 0,
        height: $fixed ? '6px' : undefined,
        width: $fixed ? '6px' : undefined,
        backgroundColor: $color,
      }}
    >
      {children}
    </View>
  );
};

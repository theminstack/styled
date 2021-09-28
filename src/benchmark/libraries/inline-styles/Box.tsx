import React, { FC } from 'react';
import { IBoxProps } from '../../types/IBoxProps';
import { View } from './View';

export const Box: FC<IBoxProps> = ({ $layout, $outer = false, $fixed = false, $color, children }) => {
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

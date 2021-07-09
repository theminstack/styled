import React, { FC } from 'react';
import View from './View';
import { IBoxProps } from '../../types/IBoxProps';

export const Box: FC<IBoxProps> = (props) => {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: props.$layout === 'column' ? 'column' : 'row',
        padding: props.$outer ? '4px' : 0,
        height: props.$fixed ? '6px' : undefined,
        width: props.$fixed ? '6px' : undefined,
        backgroundColor: props.$color,
      }}
    >
      {props.children}
    </View>
  );
};

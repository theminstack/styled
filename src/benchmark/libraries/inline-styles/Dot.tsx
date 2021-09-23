import React, { FC } from 'react';
import { IDotProps } from '../../types/IDotProps';
import { View } from './View';

export const Dot: FC<IDotProps> = (props) => {
  return (
    <View
      style={{
        position: 'absolute',
        cursor: 'pointer',
        width: 0,
        height: 0,
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 0,
        transform: 'translate(50%, 50%)',
        marginLeft: `${props.$x}px`,
        marginTop: `${props.$y}px`,
        borderRightWidth: `${props.$size / 2}px`,
        borderBottomWidth: `${props.$size / 2}px`,
        borderLeftWidth: `${props.$size / 2}px`,
        borderBottomColor: props.$color,
      }}
    >
      {props.children}
    </View>
  );
};

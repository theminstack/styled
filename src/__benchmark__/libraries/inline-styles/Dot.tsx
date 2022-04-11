import { type FC } from 'react';

import { type DotProps } from '../../types/dot-props';
import { View } from './view';

export const Dot: FC<DotProps> = (props) => {
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

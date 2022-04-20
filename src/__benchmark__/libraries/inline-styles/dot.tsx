import { type FC } from 'react';

import { type DotProps } from '../../types/dot-props';
import { View } from './view';

export const Dot: FC<DotProps> = (props) => {
  return (
    <View
      style={{
        borderBottomColor: props.$color,
        borderBottomWidth: `${props.$size / 2}px`,
        borderColor: 'transparent',
        borderLeftWidth: `${props.$size / 2}px`,
        borderRightWidth: `${props.$size / 2}px`,
        borderStyle: 'solid',
        borderTopWidth: 0,
        cursor: 'pointer',
        height: 0,
        marginLeft: `${props.$x}px`,
        marginTop: `${props.$y}px`,
        position: 'absolute',
        transform: 'translate(50%, 50%)',
        width: 0,
      }}
    >
      {props.children}
    </View>
  );
};

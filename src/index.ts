import { rehydrate } from './rehydrate';

rehydrate();

export { styled } from './styled';
export { createTheme } from './createTheme';
export { css } from './css';
export { DefaultStyleFormatter, defaultStyleFormatter } from './DefaultStyleFormatter';
export { DefaultStyleManager, defaultStyleManager } from './DefaultStyleManager';

export { StyleConfig } from './react/StyleConfig';

export { getId } from './utils/getId';
export { isStyledComponent } from './utils/isStyledComponent';

export type { HTMLTag } from './types/HTMLTag';
export type { InferProps } from './types/InferProps';
export type { IStyleConfig } from './types/IStyleConfig';
export type { IStyledComponent } from './types/IStyledComponent';
export type { IStyledSelector } from './types/IStyledSelector';
export type { IStyleFormatter } from './types/IStyleFormatter';
export type { IStyleManager } from './types/IStyleManager';

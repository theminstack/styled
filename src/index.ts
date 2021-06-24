import { rehydrate } from './rehydrate';

rehydrate();

export { styled } from './styled';
export { createTheme } from './createTheme';
export { css } from './css';
export { DefaultStyleFormatter, defaultStyleFormatter } from './DefaultStyleFormatter';
export { DefaultStyleManager, defaultStyleManager } from './DefaultStyleManager';
export { ServerStyleManager } from './ServerStyleManager';

export { StyleConfig } from './react/StyleConfig';

export { getId } from './utils/getId';
export { isStyled } from './utils/isStyled';
export { isStyledSelector } from './utils/isStyledSelector';

export type { IThemeProviderProps, ThemeHook, ThemeProvider } from './createTheme';
export type { IStyleConfigProps } from './react/StyleConfig';
export type { HtmlTag } from './types/HtmlTag';
export type { InferProps } from './types/InferProps';
export type { IStyle } from './types/IStyle';
export type { IStyleConfig } from './types/IStyleConfig';
export type { IStyledComponent } from './types/IStyledComponent';
export type { IStyledSelector } from './types/IStyledSelector';
export type { IStyledTemplateMod } from './types/IStyledTemplateMod';
export type { IStyledTemplate } from './types/IStyledTemplate';
export type { IStyleFormatter } from './types/IStyleFormatter';
export type { IStyleManager } from './types/IStyleManager';
export type { StyleHelper } from './types/StyleHelper';
export type { StylePrimitive } from './types/StylePrimitive';
export type { StylePrimitiveFactory } from './types/StylePrimitiveFactory';
export type { StyleValue } from './types/StyleValue';

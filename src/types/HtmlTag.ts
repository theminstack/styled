import { ReactHTML } from 'react';

/**
 * HTML tag names type.
 */
export type HtmlTag = Exclude<keyof ReactHTML, 'style'>;

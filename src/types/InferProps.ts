import { InferComponentProps } from './InferComponentProps';
import { InferHtmlTagProps } from './InferHtmlTagProps';

/**
 * Type helper for inferring a props type from an HTML tag string or
 * React element.
 *
 * ```ts
 * type HTMLAnchorProps = InferProps<'a'>;
 * type CustomComponentProps = InferProps<CustomComponentProps>;
 * ```
 */
export type InferProps<TType> = TType extends string ? InferHtmlTagProps<TType> : InferComponentProps<TType>;

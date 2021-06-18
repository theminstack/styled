import { InferComponentProps } from './InferComponentProps';
import { InferHTMLTagProps } from './InferHTMLTagProps';

/**
 * Type helper for inferring a properties type from an HTML tag
 * string or React element.
 *
 * ```ts
 * type HTMLAnchorProps = InferProps<'a'>;
 * type CustomComponentProps = InferProps<CustomComponentProps>;
 * ```
 */
export type InferProps<TType> = TType extends string ? InferHTMLTagProps<TType> : InferComponentProps<TType>;

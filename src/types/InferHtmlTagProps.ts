import { DetailedHTMLFactory, HTMLAttributes, LegacyRef, ReactHTML } from 'react';
import { HtmlTag } from './HtmlTag';
import { Flat } from './Utilities';

type UnknownTagAttributes = Omit<HTMLAttributes<HTMLElement>, 'ref'> & { ref?: LegacyRef<HTMLElement> };

export type InferHtmlTagProps<T> = T extends string
  ? T extends HtmlTag
    ? ReactHTML[T] extends DetailedHTMLFactory<infer P, infer E>
      ? Flat<Omit<P, 'ref'> & { ref?: LegacyRef<E> }>
      : UnknownTagAttributes
    : UnknownTagAttributes
  : never;

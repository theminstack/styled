import { DetailedHTMLFactory, HTMLAttributes, LegacyRef, ReactHTML } from 'react';
import { HTMLTag } from './HTMLTag';
import { Id } from './Utilities';

type UnknownTagAttributes = Omit<HTMLAttributes<HTMLElement>, 'ref'> & { ref?: LegacyRef<HTMLElement> };

export type InferHTMLTagProps<T> = T extends string
  ? T extends HTMLTag
    ? ReactHTML[T] extends DetailedHTMLFactory<infer P, infer E>
      ? Id<Omit<P, 'ref'> & { ref?: LegacyRef<E> }>
      : UnknownTagAttributes
    : UnknownTagAttributes
  : never;

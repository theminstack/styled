import { JSXElementConstructor } from 'react';
import { StyledTemplateProps } from '../utilities/css';
import { getClassNamesString } from '../utilities/getClassNamesString';
import { getDisplayName } from '../utilities/getDisplayName';
import { getId } from '../utilities/getId';

type Metadata<TProps extends Record<string, unknown>, TTheme extends Record<string, unknown> | undefined> = {
  component: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
  displayName: string;
  id: string;
  staticClassNames: string;
  getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string;
};

type MetadataProps<TProps extends Record<string, unknown>, TTheme extends Record<string, unknown> | undefined> = {
  ['$$tss/[VI]version[/VI]']: Metadata<TProps, TTheme>;
};

export function applyMetadata<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined,
>(component: {}, metadata: Metadata<TProps, TTheme>): void {
  (component as MetadataProps<TProps, TTheme>)['$$tss/[VI]version[/VI]'] = metadata;
}

export function getMetadata<TProps extends Record<string, unknown>, TTheme extends Record<string, unknown> | undefined>(
  _component: keyof JSX.IntrinsicElements | JSXElementConstructor<any> | MetadataProps<TProps, TTheme>,
  _displayName: string | undefined,
  _getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string,
): Metadata<TProps, TTheme> {
  const metadata =
    typeof _component !== 'string' && '$$tss/[VI]version[/VI]' in _component
      ? _component['$$tss/[VI]version[/VI]']
      : null;
  const component = (metadata?.component ?? _component) as keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
  const displayName = _displayName ?? getDisplayName(component);
  const id = getId(displayName);
  const staticClassNames = getClassNamesString(id, metadata?.staticClassNames);
  const getStyleString =
    metadata != null
      ? (props: StyledTemplateProps<TProps, TTheme>): string => metadata.getStyleString(props) + _getStyleString(props)
      : _getStyleString;

  return { component, displayName, id, staticClassNames, getStyleString };
}

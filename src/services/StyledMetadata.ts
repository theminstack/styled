import { JSXElementConstructor } from 'react';
import { StyledTemplateProps } from '../utilities/css';
import { getClassNamesString } from '../utilities/getClassNamesString';
import { getDisplayName } from '../utilities/getDisplayName';
import { getId } from '../utilities/getId';

const metadataKey = '$$tss/[VI]version[/VI]';

type StyledMetadata<TProps extends Record<string, unknown>, TTheme extends Record<string, unknown> | undefined> = {
  component: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
  displayName: string;
  id: string;
  staticClassNames: string;
  getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string;
};

type StyledMetadataProps<TProps extends Record<string, unknown>, TTheme extends Record<string, unknown> | undefined> = {
  [metadataKey]: StyledMetadata<TProps, TTheme>;
};

export function applyStyledMetadata<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined,
>(component: {}, metadata: StyledMetadata<TProps, TTheme>): void {
  (component as StyledMetadataProps<TProps, TTheme>)[metadataKey] = metadata;
}

export function getStyledMetadata<
  TProps extends Record<string, unknown>,
  TTheme extends Record<string, unknown> | undefined,
>(
  _component: keyof JSX.IntrinsicElements | JSXElementConstructor<any> | StyledMetadataProps<TProps, TTheme>,
  _displayName: string | undefined,
  _getStyleString: (props: StyledTemplateProps<TProps, TTheme>) => string,
): StyledMetadata<TProps, TTheme> {
  const metadata = typeof _component !== 'string' && metadataKey in _component ? _component[metadataKey] : null;
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

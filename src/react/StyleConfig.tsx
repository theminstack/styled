import React, { ReactElement, ReactNode, useMemo } from 'react';
import { useStyleConfig } from './useStyleConfig';
import { StyleConfigContext } from './StyleConfigContext';
import { IStyleConfig } from '../types/IStyleConfig';

export interface IStyleConfigProps extends Partial<IStyleConfig> {
  children?: ReactNode;
}

/**
 * React context provider for custom `tsstyled` configurations.
 */
export function StyleConfig(props: IStyleConfigProps): ReactElement {
  const { children, ...config } = props;
  const parentConfig = useStyleConfig();
  const value = useMemo<IStyleConfig>(() => {
    return {
      clientManager: config.clientManager ?? parentConfig.clientManager,
      serverManager: config.serverManager ?? parentConfig.serverManager,
      formatter: config.formatter ?? parentConfig.formatter,
    };
  }, [
    config.clientManager,
    config.serverManager,
    config.formatter,
    parentConfig.clientManager,
    parentConfig.serverManager,
    parentConfig.formatter,
  ]);

  return <StyleConfigContext.Provider value={value}>{children}</StyleConfigContext.Provider>;
}

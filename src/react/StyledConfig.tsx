import React, { createContext, ReactElement, ReactNode, useContext, useMemo } from 'react';
import { defaultStyleManager } from '../DefaultStyleManager';
import { defaultStyleFormatter } from '../DefaultStyleFormatter';
import { IStyleConfig } from '../types/IStyleConfig';

export interface IStyledConfigProps extends Partial<IStyleConfig> {
  children?: ReactNode;
}

const Context = createContext<IStyleConfig>({
  serverManager: null,
  clientManager: defaultStyleManager,
  formatter: defaultStyleFormatter,
});

/**
 * TSS configuration hook.
 */
export function useStyledConfig(): IStyleConfig {
  return useContext(Context);
}

/**
 * TSS configuration provider.
 */
export function StyledConfig({ children, ...config }: IStyledConfigProps): ReactElement {
  const parentConfig = useStyledConfig();
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

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

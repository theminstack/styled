import { IStyleManager } from './IStyleManager';
import { IStyleFormatter } from './IStyleFormatter';

/**
 * Styles and stylesheets configuration.
 */
export interface IStyleConfig {
  /**
   * A style manager adds style elements when styles are
   * registered, and removes them when they are unregistered.
   *
   * No style manager (null) is used by default for SSR, which will
   * cause all dynamic <style> elements to be injected inline. The
   * inlined styles will be hoisted to the document <head> on the
   * client when rehydrating the SSR rendered page.
   */
  readonly serverManager: IStyleManager | null;

  /**
   * A style manager adds style elements when styles are
   * registered, and removes them when they are unregistered.
   */
  readonly clientManager: IStyleManager;

  /**
   * The CSS text formatter controls how CSS is formatted.
   *
   * Using a custom CSS formatter allows control over how CSS rules
   * are formatted.
   */
  readonly formatter: IStyleFormatter;
}

import { type Stylesheet } from './stylesheet.js';

type StylesheetCollection = {
  readonly add: (stylesheet: Stylesheet) => Stylesheet;
  readonly remove: (stylesheet: Stylesheet) => Stylesheet;
  readonly toHtmlString: () => string;
};

const createStylesheetCollection = (): StylesheetCollection => {
  const items = new Set<Stylesheet>();

  return {
    add: (item) => {
      items.add(item);
      item.mount?.();
      return item;
    },
    remove: (item) => {
      if (items.delete(item)) {
        item.unmount?.();
      }
      return item;
    },
    toHtmlString: () => {
      let html = '';

      for (const { cssString, data } of items) {
        html += '<style data-tss=' + JSON.stringify('' + data) + '>\n' + cssString + '\n</style>\n';
      }

      return html.trim();
    },
  };
};

export { type StylesheetCollection, createStylesheetCollection };

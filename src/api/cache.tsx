import { type AstNode, compile } from '../syntax/compile.js';
import { format } from '../syntax/format.js';
import { getHashString, hash } from '../util/hash.js';

type StyledCache = {
  readonly resolve: (styleString: string, classNames?: string) => [cssText: string, className: string];
  readonly resolveGlobal: (styleString: string) => string;
};

const getClassName = (ast: AstNode): string => {
  return '_rmsd' + getHashString(hash(JSON.stringify(ast))) + '_';
};

const createAstCache = () => {
  const astByStyle = new Map<string, [ast: AstNode, className: string]>();
  const astByClass = new Map<string, AstNode>();

  return {
    resolve: (styleString: string, classNames?: string): [ast: AstNode, className: string] => {
      let base = astByStyle.get(styleString);

      if (!base) {
        const ast = compile(styleString);
        const className = getClassName(ast);

        base = [ast, className];
        astByStyle.set(styleString, base);
      }

      let [ast, className] = base;

      const classNamesArray = classNames?.split(/\s+/g).filter((value) => value);

      if (classNamesArray?.length) {
        ast = {
          children: classNamesArray.reduce((result, overrideClass) => {
            return [...result, ...(astByClass.get(overrideClass)?.children ?? [])];
          }, ast.children),
        };
        className = getClassName(ast);
      }

      astByClass.set(className, ast);

      return [ast, className];
    },
  };
};

const createStyledCache = (): StyledCache => {
  const astCache = createAstCache();
  const cssCacheGlobal = new Map<string, string>();
  const cssCacheScoped = new Map<`${string}\0${string}`, [cssText: string, className: string]>();

  return {
    resolve: (styleString, classNames = '') => {
      let resolved = cssCacheScoped.get(`${styleString}\0${classNames}`);

      if (!resolved) {
        const [ast, className] = astCache.resolve(styleString, classNames);
        const cssText = format(ast, '.' + className);

        resolved = [cssText, className];
        cssCacheScoped.set(`${styleString}\0${classNames}`, resolved);
      }

      return [...resolved];
    },
    resolveGlobal: (styleString) => {
      let resolved = cssCacheGlobal.get(styleString);

      if (!resolved) {
        const [ast] = astCache.resolve(styleString);
        resolved = format(ast);
        cssCacheGlobal.set(styleString, resolved);
      }

      return resolved;
    },
  };
};

const defaultStyledCache = createStyledCache();

export { type StyledCache, createStyledCache, defaultStyledCache };

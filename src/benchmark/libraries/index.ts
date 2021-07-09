import schemaLibraryConfig, { LibraryConfig } from '../types/schemaLibraryConfig';

const context = require.context('.', true, /\/.+\/index\.tsx?$/);

export default context.keys().reduce<Record<string, LibraryConfig>>((acc, key) => {
  const value = schemaLibraryConfig.parse(context(key));
  return { ...acc, [value.name]: value };
}, {});

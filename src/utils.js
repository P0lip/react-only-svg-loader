import { getOptions } from 'loader-utils';

export const rewriteQuery = (loaderContext, fields) => {
  const newQuery = {};
  const query = getOptions(loaderContext);
  // shallow copy is alright in this case
  const newLoaderContext = Object.assign({}, loaderContext, { query: newQuery });

  fields.forEach((field) => {
    newQuery[field] = query[field];
  });

  return newLoaderContext;
};

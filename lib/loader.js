'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var loaderUtils = require('loader-utils');
var reactSvgCore = require('react-svg-core');
var babel = require('babel-core');
var fallback = _interopDefault(require('url-loader'));

const rewriteQuery = (loaderContext, fields) => {
  const newQuery = {};
  const query = loaderUtils.getOptions(loaderContext);
  // shallow copy is alright in this case
  const newLoaderContext = Object.assign({}, loaderContext, { query: newQuery });

  fields.forEach(field => {
    newQuery[field] = query[field];
  });

  return newLoaderContext;
};

function loader(src) {
  // eslint-disable-next-line no-underscore-dangle
  const issuer = this._module.issuer.userRequest;
  if (/\.jsx?$/.test(issuer)) {
    const cb = this.async();
    const loaderOpts = loaderUtils.getOptions(this);

    // based on https://github.com/boopathi/react-svg-loader/blob/master/packages/react-svg-core/src/index.js
    Promise.resolve(String(src)).then(reactSvgCore.optimize(loaderOpts.svgo)).then(reactSvgCore.transform({ jsx: false })).then(({ code }) => babel.transform(code, {
      presets: ['es2015']
    })).then(result => cb(null, result.code)).catch(err => cb(err));
  }

  return fallback.call(rewriteQuery(this, ['limit']), src);
}

module.exports = loader;

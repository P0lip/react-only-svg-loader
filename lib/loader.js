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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var loader = (() => {
  var _ref = _asyncToGenerator(function* (src) {
    var _getOptions = loaderUtils.getOptions(this);

    const minification = _getOptions.minification;

    var _parseQuery = loaderUtils.parseQuery(this.resourceQuery);

    const inline = _parseQuery.inline;


    const cb = this.async();
    try {
      const svg = yield reactSvgCore.optimize(minification)(String(src));
      if (inline) {
        cb(null, babel.transform(svg, {
          presets: ['es2015', 'react'],
          plugins: ['syntax-jsx', 'transform-object-rest-spread', 'babel-plugin-react-svg']
        }).code);
      } else {
        cb(null, fallback.call(rewriteQuery(this, ['limit']), svg));
      }
    } catch (err) {
      cb(err);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = loader;

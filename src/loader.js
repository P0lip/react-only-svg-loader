import { optimize, transform } from 'react-svg-core';
import * as babel from 'babel-core';
import { getOptions } from 'loader-utils';
import fallback from 'url-loader';
import { rewriteQuery } from './utils';

export default function loader(src) {
  // eslint-disable-next-line no-underscore-dangle
  const issuer = this._module.issuer.userRequest;
  if (/\.jsx?$/.test(issuer)) {
    const cb = this.async();
    const loaderOpts = getOptions(this);

    // based on https://github.com/boopathi/react-svg-loader/blob/master/packages/react-svg-core/src/index.js
    Promise.resolve(String(src))
      .then(optimize(loaderOpts.svgo))
      .then(transform({ jsx: false }))
      .then(({ code }) => babel.transform(code))
      .then(result => cb(null, result.code))
      .catch(err => cb(err));
  }

  return fallback.call(rewriteQuery(this, ['limit']), src);
}

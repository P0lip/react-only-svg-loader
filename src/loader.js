import { optimize } from 'react-svg-core';
import * as babel from 'babel-core';
import { getOptions } from 'loader-utils';
import fallback from 'url-loader';
import { rewriteQuery } from './utils';

export default async function (src) {
  const {
    minification,
  } = getOptions(this);

  // todo: parse query
  const inline = this.resourceQuery.includes('inline');

  const cb = this.async();
  try {
    const svg = String(src);
    if (inline) {
      cb(
        null,
        babel.transform(await optimize(minification)(svg), {
          presets: ['es2015', 'react'],
          plugins: ['syntax-jsx', 'transform-object-rest-spread', 'babel-plugin-react-svg'],
        }).code,
      );
    } else {
      cb(null, fallback.call(rewriteQuery(this, ['limit']), svg));
    }
  } catch (err) {
    cb(err);
  }
}

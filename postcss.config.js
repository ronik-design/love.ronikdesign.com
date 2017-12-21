'use strict';

let plugins = [
  require('postcss-custom-media'),
  require('postcss-media-minmax'),
  require('autoprefixer')({
    browsers: '> 5%'
  }),
  require('lost')
];

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    require('postcss-urlrev'),
    require('cssnano')
  ]);
}

module.exports =  {
  plugins
};

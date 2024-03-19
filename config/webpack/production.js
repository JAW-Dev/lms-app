process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
// const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');
const environment = require('./environment');

// environment.splitChunks();

// ensure classes with special chars like -mt-1 and md:w-1/3 are included
// class TailwindExtractor {
//   static extract(content) {
//     return content.match(/[\w-/:]+(?<!:)/g);
//   }
// }

// function collectWhitelist() {
//   return [
//     /(swiper|btn|notes|course-item|behavior|draggable|nav|progress-bar|order-form|cart-item|vidyard-player|trix|DayPicker*|DateRangePicker|modal*|quiz*|answer*|access-paths*|gift-*|hs-*|animate__animated|animate__faster|animate__slideInRight|animate__slideOutLeft)/
//   ];
// }

// environment.plugins.append(
//   'PurgecssPlugin',
//   new PurgecssPlugin({
//     keyframes: true,
//     paths: glob.sync([
//       // path.join(__dirname, '../../app/webpacker/css/*.css'),
//       path.join(__dirname, '../../app/webpacker/**/*.js'),
//       path.join(__dirname, '../../app/views/**/*.erb'),
//       path.join(__dirname, '../../app/views/**/*.jsx')
//     ]),
//     whitelistPatternsChildren: collectWhitelist,
//     extractors: [
//       {
//         extractor: TailwindExtractor,
//         extensions: ['erb', 'js', 'jsx']
//       }
//     ]
//   })
// );

module.exports = environment.toWebpackConfig();

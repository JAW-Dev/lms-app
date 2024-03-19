process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.WP_ROUTE =
  process.env.NODE_ENV === 'development'
    ? 'http://admiredleadership.local'
    : 'http://admiredleadership.com';

const environment = require('./environment');

module.exports = environment.toWebpackConfig();

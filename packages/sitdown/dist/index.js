
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./src.cjs.production.min.js')
} else {
  module.exports = require('./src.cjs.development.js')
}

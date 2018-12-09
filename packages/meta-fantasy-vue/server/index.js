/* eslint-disable */
const dotenv = require('dotenv')

dotenv.config()

require = require('esm')(module)
module.exports = require('./server.js').default

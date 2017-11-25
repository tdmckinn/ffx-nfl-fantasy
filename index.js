/* eslint-disable */
const dotenv = require('dotenv')

dotenv.config()

require = require('@std/esm')(module)
module.exports = require('./server.js').default

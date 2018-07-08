const path = require('path')

module.exports = {
  runtimeCompiler: true,
  assetsDir: 'static',
  devServer: {
    https: false,
    proxy: {
      '/api/**':  { target: 'http://localhost:7777', secure: false }
    }
  }
}
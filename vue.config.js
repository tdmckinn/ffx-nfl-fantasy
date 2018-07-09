const path = require('path')
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  runtimeCompiler: true,
  assetsDir: 'static',
  devServer: {
    https: false,
    proxy: {
      '/api':  { target: 'http://localhost:7777', secure: false }
    }
  },
  configureWebpack: {
    plugins: [
      new ManifestPlugin({ fileName: 'webpack.manifest.json' })
    ]
  }
}

const webpack =  require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin');
// const { stringified } = require('./env')

// console.log(stringified)

module.exports = {
  runtimeCompiler: true,
  assetsDir: 'static',
  devServer: {
    https: false,
    host: '0.0.0.0',
    port: 8081,
    proxy: {
      '/api':  { target: 'http://localhost:7777', secure: false }
    }
  },
  configureWebpack: {
    plugins: [
      new ManifestPlugin({ fileName: 'webpack.manifest.json' }),
    ]
  }
}

const webpack =  require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin');
// const { stringified } = require('./env')

// console.log(stringified)

module.exports = {
  runtimeCompiler: true,
  assetsDir: 'static',
  devServer: {
    https: false,
    port: 7777
  },
  configureWebpack: {
    plugins: [
      new ManifestPlugin({ fileName: 'webpack.manifest.json' }),
    ]
  }
}
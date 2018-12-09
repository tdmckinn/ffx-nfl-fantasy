const fs = require('fs')
const path = require('path')

const webpackManifest = require('../dist/webpack.manifest.json')

fs.readFile(path.join(__dirname, '../dist/nfx-sw.js'), 'utf8', (err,data) => {
  if (err) {
    return console.log(err);
  }
  const result = data
    .replace(/<% FILES_TO_CACHE %>/g, JSON.stringify(webpackManifest))
    .replace('<% CACHE_KEY %>', require('crypto')
      .randomBytes(32)
      .toString('hex')
      .slice(0, 8));

  fs.writeFile(path.join(__dirname, '../dist/nfx-sw.js'), result, 'utf8', (err) => {
     if (err) return console.log(err);
  });
});

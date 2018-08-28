/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import https from 'https'
import express from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import router from './router'

const getDevelopmentCertificate = require('devcert-with-localhost').default;
const debug = require('debug')('api-server');
const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const app = express()

const serve = (_path, cache) => express.static(resolve(_path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

require('dotenv').config()

app.use(cors())
app.use('/', serve('../dist'))
app.use('/images', serve('../dist/images'))
app.use('/static', serve('../dist/static'))
app.use('/public', serve('../public'))

// handle fallback for HTML5 history API
app.use(history({ verbose: true }))

app.use('/api', router)

app.get('/', (req, res) => {
  res.sendFile(resolve('../dist/index.html'))
})

// Catch all send to index.html
app.get('*', (req, res) => {
  res.sendFile(resolve('../dist/index.html'))
})

function startAndListen(app, port) {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Server started securly listening at ${port}`)
      resolve();
    });
  })
}

if (isProd && process.env.ENV_LOCAL) {
  debug('Attempting to get certificate');
  return getDevelopmentCertificate('nfx-fantasy', { installCertutil: true }).then((ssl) => {
    debug('SSL configuration received. Starting app server');
    return startAndListen(https.createServer(ssl, app), 8080);
  })
} else {
  const port = process.env.PORT || (isProd ? 8080 : 7777)
  app.listen(port, () => {
    console.log(`server started at listening at ${port}`)
  })
}



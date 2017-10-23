/* eslint-disable no-unused-vars */
const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const history = require('connect-history-api-fallback')

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const app = express()
const router = require('./router')

const serve = (_path, cache) => express.static(resolve(_path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

require('dotenv').config()

app.use(cors())
app.use('/static', serve('./dist/static'))
app.use('/dist', serve('./dist'))
app.use('/public', serve('./public'))

// handle fallback for HTML5 history API
app.use(history({ verbose: true }))

app.use('/api', router)

app.get('/', (req, res) => {
  res.sendFile(resolve('./dist/index.html'))
})

// Catch all send to index.html
app.get('*', (req, res) => {
  res.sendFile(resolve('./dist/index.html'))
})

const port = process.env.PORT || (isProd ? 8080 : 7777)
app.listen(port, () => {
  console.log(`server started at listening at ${port}`)
})

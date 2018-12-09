const fs = require('fs')
const path = require('path')

const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const appDirectory = fs.realpathSync(process.cwd())

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  )
}

const dotenvPath = resolveApp('.env')
const dotenvFiles = [
  `${dotenvPath}.${NODE_ENV}.local`,
  `${dotenvPath}.${NODE_ENV}`,
  `${dotenvPath}.local`,
  dotenvPath
].filter(Boolean)

dotenvFiles.forEach(dotenvFile => {
  console.log(dotenvFile)
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile
    })
  }
})

const raw = Object.keys(process.env)
.reduce(
  (env, key) => {
    env[key] = process.env[key]
    return env
  }
)

// Stringify all values so we can feed into Webpack DefinePlugin
const stringified = {
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key])
    return env
  }, {})
}

module.exports = { raw, stringified }

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const IP = require('./ip')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: IP.proxyTable ? '"/api"' : IP.target
})

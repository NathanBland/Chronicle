var express = require('express')
exports.setup = function (app) {
  var router = express.Router()

  var user = require('./user.js')

  router.use('/user', user.setup(app))

  return router
}

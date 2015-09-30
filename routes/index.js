var express = require('express')
exports.setup = function (app) {
  var router = express.Router()

  var v1 = require('./api/v1')

  router.use('/api/v1', v1.setup(app))

  return router
}

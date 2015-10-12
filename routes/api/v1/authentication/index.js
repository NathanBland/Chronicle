exports.setup = function (app, express) {
  var router = express.Router()

  var local = require('./local')

  router.use('/local', local.setup(app, express))

  return router
}

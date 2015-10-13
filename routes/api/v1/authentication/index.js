exports.setup = function (app, express) {
  var router = express.Router()

  var local = require('./local.js')

  router.use('/local', local.setup(app, express))

  return router
}

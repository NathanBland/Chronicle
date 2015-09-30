exports.setup = function (app, express) {
  var router = express.Router()

  var user = require('./user.js')

  router.use('/user', user.setup(app))

  return router
}

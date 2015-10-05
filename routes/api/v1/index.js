exports.setup = function (app, express) {
  var router = express.Router()

  var user = require('./user.js')
  var journal = require('./journal.js')

  router.use('/user', user.setup(app, express))
  router.use('/entry', journal.setup(app, express))

  return router
}

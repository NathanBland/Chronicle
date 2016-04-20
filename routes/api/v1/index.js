exports.setup = function (app, express) {
  var router = express.Router()

  var auth = require('./authentication')
  var user = require('./user.js')
  var journal = require('./journal.js')

  router.use('/auth', auth.setup(app, express))
  router.use('/user', user.setup(app, express))
  router.use('/entry', journal.setup(app, express))
  router.route('/')
    .get(function (req, res, next) {
      return res.status(200).json({
        'message': 'Welcome to the Api',
        'endpoints': ['/auth', '/user', '/entry']
      })
    })
  return router
}

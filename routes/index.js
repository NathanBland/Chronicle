exports.setup = function (app, express) {
  var router = express.Router()

  var v1 = require('./api/v1')

  router.use('/api/v1', v1.setup(app, express))
  router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Chroncile'
    })
  })
  return router
}

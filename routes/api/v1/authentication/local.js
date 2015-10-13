var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var AnonymousStrategy = require('passport-anonymous').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy
var jwt = require('jwt-simple')
var tokenSecret = 'a really awful secret'
var User = require('../../../../models/User.js')

exports.setup = function (app, express) {
  var router = express.Router()
    /**
     * Strategy implementation.
     */
  passport.use(new BearerStrategy(
    function (token, done) {
      try {
        var decoded = jwt.decode(token, tokenSecret)
        console.log(decoded)
        User.findById(decoded.id, function (err, user) {
          if (err) { throw err }
          if (!user) {
            return done(null, false)
          } else {
            return done(null, user)
          }
        })
      } catch (err) {
        return done(null, false)
      }
    }
  ))
  passport.use(new LocalStrategy(User.authenticate()))
  passport.use(new AnonymousStrategy())
  /**
   * Strategy Routes
   */
  router.post('/register', function (req, res, next) {
    User.register(new User({
      username: req.body.username
    }), req.body.password, function (err, user) {
      if (err) {
        return res.status(400).json({
          'error': err
        })
      }
      passport.authenticate('local', {session: false})(req, res, function () {
        var token = jwt.encode({
          id: req.user.id,
          username: req.user.username},
          tokenSecret)
        return res.status(200).json({
          token: token
        })
      })
    })
  })
  router.post('/login',
    passport.authenticate('local', {
      session: false
    }), function (req, res) {
      var token = jwt.encode({
        id: req.user.id,
        username: req.user.username},
        tokenSecret)
      return res.status(200).json({
        token: token
      })
    })

  return router
}

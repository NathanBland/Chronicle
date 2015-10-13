var Journal = require('../../../models/Journal')
var User = require('../../../models/User')
var passport = require('passport')

exports.setup = function (app, express) {
  var router = express.Router()

  router.route('/user/:user')
    .get(function (req, res, next) {
      if (req.params.user === 'anon') {
        return res.status(400).json({
          'error': 'Not Allowed for anon.'
        })
      } else if (req.params.user) {
        User.findOne({username: req.params.user}, function (err, user) {
          if (err) {
            return res.status(400).json({
              'error': 'Invalid Username specified'
            })
          }
          user.getEntries()
            .sort('updated')
            .exec(function (err, entries) {
              if (err) {
                return res.status(400).json({
                  'error': 'Internal Server Error'
                })
              }
              return res.status(200).json(entries)
            })
        })
      } else {
        return res.status(400).json({
          'error': 'No Username specified'
        })
      }
    })
    .post(passport.authenticate(['bearer', 'anonymous'], { session: false }))
    .post(function (req, res, next) {
      if (!req.body.content || req.body.content === '') {
        return res.status(400).json({
          'error': 'Content can not be blank!'
        })
      }
      var entry = new Journal()
      var alias = ''
      if (req.body.title) {
        alias = req.body.title.toLowerCase().replace(' ', '-') +
          '-' + new Date().toISOString()
      } else {
        alias = new Date().toISOString()
      }
      if (req.params.user === 'anon') {
        console.log('anon detected.')
        entry.set({
          title: req.body.title || 'Entry on ' + new Date(),
          content: req.body.content,
          alias: alias
        })
        entry.save(function (err) {
          if (err) {
            return res.status(400).json({
              'error': 'Internal Server Error'
            })
          } else {
            return res.status(201).json(entry)
          }
        })
      } else if (req.params.user && req.params.user !== '' && req.user) {
        console.log('req.user:', req.user)
        if (req.user.username !== req.params.user) {
          console.log('req.params.user:', req.params.user)
          return res.status(401).json({
            'error': 'Unauthorized'
          })
        }
        User.findOne({username: req.params.user}, function (err, user) {
          if (err) {
            return res.status(400).json({
              'error': err
            })
          }
          entry.set({
            title: req.body.title || 'Entry on ' + new Date(),
            content: req.body.content,
            alias: alias,
            user_id: user._id
          })
          entry.save(function (err) {
            if (err) {
              return res.status(400).json({
                'error': 'Internal Server Error'
              })
            } else {
              return res.status(201).json(entry)
            }
          })
        })
      } else {
        return res.status(401).json({
          'error': 'Unauthorized'
        })
      }
    })

  router.route('/user/:user/entry/:entry')
    .put(passport.authenticate('bearer', { session: false }))
    .delete(passport.authenticate('bearer', { session: false }))
    .get(function (req, res, next) {
      if (!req.params.user || !req.params.entry) {
        return res.status(400).json({
          'error': 'Invalid Username or entry specified'
        })
      }
      if (req.params.user === `anon`) {
        Journal.findOne({alias: req.params.entry},
          '-_id',
           function (err, entry) {
             if (err) {
               return res.status(500).json({
                 'error': 'Internal Server error'
               })
             }
             return res.status(200).json(entry)
           })
      } else {
        User.findOne({username: req.params.user}, function (err, user) {
          if (err) {
            return res.status(400).json({
              'error': 'Invalid user'
            })
          }
          Journal.findOne({
            alias: req.params.entry,
            user_id: user._id
          },
            '-_id',
             function (err, entry) {
               if (err) {
                 return res.status(500).json({
                   'error': 'Internal Server error'
                 })
               }
               return res.status(200).json(entry)
             })
        })
      }
    })
    .put(function (req, res, next) {
      if (!req.params.user || (req.params.user !== req.user)) {
        return res.status(400).json({
          'error': 'Invalid user specified!'
        })
      }
      if (!req.body.title && !req.body.content) {
        return res.status(400).json({
          'error': 'Title or content required!'
        })
      }
      User.findOne({
        username: req.params.user
      }, function (err, user) {
        if (err) {
          return res.status(400).json({
            'error': 'Invalid user'
          })
        }
        var query = { alias: req.params.entry }
        var obj = {updated: new Date()}
        if (req.body.title) {
          obj.title = req.body.title
        }
        if (req.body.content) {
          obj.content = req.body.content
        }
        Journal.findOneAndUpdate(query, obj,
         function (err, entry) {
           if (err) {
             return res.status(500).json({
               'error': 'Internal Server error'
             })
           }
           return res.status(200).json(entry)
         })
      })
    })
    .delete(function (req, res, next) {
      if (!req.params.user || (req.params.user !== req.user)) {
        return res.status(400).json({
          'error': 'Invalid user specified!'
        })
      }
      User.findOne({
        username: req.params.user
      }, function (err, user) {
        if (err) {
          return res.status(400).json({
            'error': 'Invalid user'
          })
        }
        Journal.findOneAndRemove({alias: req.params.entry},
          function (err, result) {
            if (err) {
              return res.status(500).json({
                'error': 'Internal Server error'
              })
            }
            return res.status(204).json(result)
          })
      })
    })
  return router
}

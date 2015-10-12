var mongoose = require('mongoose')
var Journal = require('./Journal')

var User = mongoose.Schema({
  username: {
    type: String,
    required: false
  }
})

User.plugin(require('passport-local-mongoose'))

User.methods.getEntries = function (callback) {
  return Journal.find({
    user_id: this._id
  }, callback)
}
module.exports = mongoose.model('user', User)

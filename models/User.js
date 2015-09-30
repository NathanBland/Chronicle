var mongoose = require('mongoose')

var User = mongoose.Schema({
  username: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('user', User)

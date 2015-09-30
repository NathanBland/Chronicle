var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var routes = require('./routes/')
var app = express()

app.set('dbhost', '127.0.0.1')
app.set('dbname', 'chronicle')

mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'))

app.set('port', 8081)
app.set('ip', '0.0.0.0')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(routes.setup(app, express))

var server = app.listen(app.get('port'), app.get('ip'), function () {
  console.log('Chronicle has started...')
})

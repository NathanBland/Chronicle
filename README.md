# Chronicle
A repository that aims to instruct the basic building blocks of `node.js`, `express`, `mongodb`, `mongoose`, and authentication with `passport`.

## Introduction
There is a lot going in in the JavaScript world, and a lot of it can be overwhelming to take in.
This repository aims to act as a guide to instruct those who may be new to this wonderful world
and hopes to advise some best practices along the way.

To do this we will be creating a journal application. It should be able to have
multiple users, and it should allow each of these users to Create, Read, Update,
& delete entries, or be a `CRUD` application. It should do this in a RESTful manner.

In order to avoid "throw away" code in this project, we'll begin by doing data
modeling **first** so that we have something to actually use with our application
instead of having a boring `hello world` example.

### Getting Started

#### Prerequisites
This guide makes some assumptions. Those being:
 - That you have [node.js](https://nodejs.org/en/) & its friend `npm` installed
 - That you have [git](https://git-scm.com/) installed
 - That you have [mongoDB](https://www.mongodb.org/) installed
 - That you have a basic working knowledge of `git` and `JavaScript`
 - You have access to a `linux/*nix` environment
 - You know how to type commands into a terminal
If you do not meet these requirements, the sites linked above have some great resources to get going.

#### Setting It All Up
The first step is making a repository for your project. While the code is all
available on this repository, for your sake, please do not clone it. You may
use it as a reference, but that should be the extent of it unless you want to
pull down the fully working application to view for each block.

Enough talk, let's get going.

##### Getting a Repository
In order to get yourself a clean project slate, let's make a project folder and
repository for you to work in. *I'll be using the name `Chronicle` as my project
name throughout this guide*
`$ mkdir Chronicle`
Cool, lets hop over to it.
`$ cd Chronicle`
Now let's setup git.
`$ git init`
which should result in something like
`$ Initialized empty Git repository in /home/nathan/Projects/node/chronicle/.git/`
Great. Let's get our node environment setup.
`$ npm init`
This will prompt you with a brief project setup wizard. Most of the default values will be fine, we will change the `entry point` to be `server.js` from `index.js`. Feel free to fill in the author and license as you see fit, for my version, I'm using `MIT` as a license.

Now that your npm is configured you should have a shiny new `package.json` file
in your directory. This file is used for all kinds of things, but we will mostly use it to save what packages we want npm to install for us.

Before we start installing things we need to do something crucial, and that is make a `.gitignore` file so that we don't track things with git that we don't need to.

The easiest way for us to do this in this project is going to be with an `echo`
command. You could also create the file and manually type it in if you wished.

To do this, lets run this:
`$ ehco 'node_modules' > .gitignore`
This should create the file `.gitignore` for us and place the line `node_modules`
in it. Great! Now we can start installing things.

##### Installing Mongoose
In order to start with our data models, we need one other component, and that is [mongoose](http://mongoosejs.com/). Mongoose let's us create schema for `mongoDB` something that is not possible with mongo alone.

Let's try grabbing it with npm.
`$ npm install --save mongoose`
This tells npm - which is the **N**node **P**ackage **M**anager - to install **mongoosejs** for us. It also saves `mongoose` as a dependency for our project, which you can see in `package.json`.

##### Making a User Model
Now that `mongoose` is done installing, we can start making models.
Let's make a folder for our models to live in, and go to it.
`$ mkdir models`
`$ cd models`

Now let's make a basic user model. To do this we need a file to describe what a
user is. So let's make one:
`$ touch User.js`

Now if we open that file up (you can use whatever editor you would like, personally I'm using [atom](http://atom.io/))
we can start making our user model.

```javascript
var mongoose = require('mongoose')

var User = mongoose.Schema({
  username: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('user', User)
```
There is a bit of new information, so I'll try to cover what each piece is, and
why we need it.

```javascript
var mongoose = require('mongoose')
```
This section of code simply tells JavaScript - in this case `node.js` - to include mongoose. This is what allows us to the things mongoose provides. It's like a plugin we are electing to use.

```javascript
var User = mongoose.Schema({
  username: {
    type: String,
    required: false
  }
})
```
There is a lot going on in this little statement. First of all we are creating a new variable `User` and we are telling it to be the result of the function `mongoose.Schema()` which will create the record we want to use with a database. We are then passing in an object - that's the stuff between the `{}`. So we are giving it a property called `username` and saying that it should be a type of `String` and shouldn't be required. Why is that? Mostly for the possibility of other authentication methods, such as twitter, that we will cover later, but it isn't the only useful thing that does for us.

```javascript
module.exports = mongoose.model('user', User)
```
This last line says what should be accessible from this file when it is used in
something else (like our server). Here we are saying we want to make that `User` schema that we just made available to whatever else includes this file. This way, we can use it later, and not have to make the model in the same file as our other code. It keeps things neat.

We will eventually come back to this file, but now we have something we can work with. Let's start Using it!

##### Installing express
Now that we have a data model, we can start to write things that let us access
that data. To do this we will create a simple API with node and express that
return simple `json` objects to us. If we are careful, we will be able to use
this same API later, and won't have to rewrite our code.

Let's get back to the root of our project folder

`$ cd ../`

and now let's make ourselves a server file

`$ touch server.js`

While we are here, let's create a few things we'll use in the future.

`$ mkdir routes`

`$ mkdir -p views/partials`

`$ mkdir public`

While we won't use some of these folders immediately, they will be nice for us
to have in place as we go along.

Let's install express

`$ npm install --save express`

[Express](http://expressjs.com/) is a web application framework for `node` and
it is incredibly powerful.

Let's grab something else we want to work with it.

`$ npm install --save body-parser`

Ok, time to open up `server.js` we made just a moment ago.

```javascript
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

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

var server = app.listen(app.get('port'), app.get('ip'), function () {
  console.log('Chronicle has started...')
})
```
By now, at least some of this code should look familiar. The `require()` statements just mean that we are including things that we need to make our app run, `var app = express()` is just setting `app` to be the result of `experss()`. Next up we have something new, and that is `app.set`. Here we are telling express that we want to set different properties - in this case `dbhost` and `dbname` - to equal the next value we provide. It is essentially a key-value store that we are accessing.

Next up is `mongoose.connect` this is just telling our application where our database lives, and what we want to use as a name for it. This uses the values we setup on the previous lines.

The next new bit of code we see is `bodyParser`. This is used to allow specific types of requests (think form data) to be handled by the server. Here we are allowing json requests, and urlencoded data.

Last, but not least is our `var server` which is actually what starts up our express server, and selects what port, and ip address to listen on. Again, here we are using values we set earlier, but you could also pass the numbers in manually here.

Let's see if our server starts... *hint: make sure mongod is running first or you will get an error.*

`$ node server.js`

This should produce something like
`Chronicle has started...`
or whatever message you put into your `console.log`. If you do that means your application is running without errors! Lets try and talk to it...

`$ curl http://127.0.0.1:8081`

which results in...

`Cannot GET /`

This means our server **is** running, but since we haven't defined any routes for it to use yet, it doesn't know how to answer our request, so it simply returns a default error message.

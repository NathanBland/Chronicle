# Chronicle
A repository that aims to instruct usage of basic building blocks of `node.js`, `express`, `mongodb`, `mongoose`, and authentication with `passport`.

## Introduction
There is a lot going on in the JavaScript world, and a lot of it can be overwhelming to take in.
This repository aims to act as a guide to instruct those who may be new to this wonderful world
and hopes to advise some best practices along the way.

To do this we will be creating a journal application. It will have multiple users, and it will allow each of these users to Create, Read, Update, & Delete entries, also known as a `CRUD` application. It will do this in a REST-ful manner.

To create a solid base for this project, we'll start off with data modeling and progress to an API to access that data. This will give us a solid understanding of what we are accessing, and avoid writing code that will be discarded later.

### Getting Started

#### Prerequisites
This guide makes some assumptions. Those being:
 - That you have [node.js](https://nodejs.org/en/) & its friend `npm` installed
  - npm is installed when you install [node.js](https://nodejs.org/en/), but may need to be updated to the most recent version: `npm install npm -g`
 - That you have [git](https://git-scm.com/) installed
 - That you have [mongoDB](https://www.mongodb.org/) installed and can start and stop its service
 - That you have a basic working knowledge of `git` and `JavaScript`
 - You have access to a `linux/*nix` environment *This can be done on a windows system, but some of the commands may be different*
 - You know how to type commands into a terminal
If you are unsure of these setup steps or simply want a refresher, the sites linked above have great resources to get going.

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

which will result in something like

`$ Initialized empty Git repository in /home/nathan/Projects/node/chronicle/.git/`

Great. Let's get our node environment setup.

`$ npm init`

This will prompt you with a brief project setup wizard. Most of the default values will be fine. Hit `enter` or `return` to advance through the wizard. We will change the `entry point` to be `server.js` from `index.js`. Feel free to fill in the author and license as you see fit, for my version, I'm using `MIT` as a license.

Now that your npm is configured, you have a shiny new `package.json` file
in your directory. This file is used for all kinds of things, but we will mostly use it to save what packages we want npm to install for us.

Before we start installing things we need to do something crucial, and that is make a `.gitignore` file so that we don't track files with git that we don't need to.

In this project we are going to do this with an `echo` command. You could also create the file and manually type it in if you wished with something like `touch .gitignore`.

To do this, lets run this:
`$ ehco 'node_modules' > .gitignore`
This will create the file `.gitignore` for us and place the line `node_modules`
in it. Great! Now we can start installing things.

##### Installing Mongoose
In order to start with our data models, we need one other component, and that is [mongoose](http://mongoosejs.com/). Mongoose let's us create a schema for `mongoDB`, something that is not possible with mongo alone.

Let's try grabbing it with npm.
`$ npm install --save mongoose`
This command tells npm - which is the **N**ode **P**ackage **M**anager - to install **mongoosejs** for us. It also saves `mongoose` as a dependency for our project, which you can see in `package.json`.

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
This section of code simply tells JavaScript - in this case `node.js` - to include mongoose. This is what allows us to the features mongoose provides. It's like a plugin we are electing to use.

```javascript
var User = mongoose.Schema({
  username: {
    type: String,
    required: false
  }
})
```
There is a lot going on in this little statement. First of all we are creating a new variable `User` and we are telling it to be the result of the function `mongoose.Schema()` which will create the record we want to use with a database. We are then passing in an object - that's the stuff between the `{}`. So we are giving it a property called `username` and saying that it will be a type of `String` and isn't required. Why is that? Mostly for the possibility of other authentication methods, such as twitter, that we will cover later, but it isn't the only useful thing that does for us.

```javascript
module.exports = mongoose.model('user', User)
```
This last line says what will be accessible from this file when it is used in
something else (like our server). Here we are saying we want to make that `User` schema that we just made available to whatever else includes this file. This way, we can use it later, and not have to make the model in the same file as our other code. It keeps things neat.

We will eventually come back to this file, but now we have something we can work with. Let's start Using it!

##### Installing express
Now that we have a data model, we can start to write things that let us access
that data. To do this we will create a simple API with node and express that
return simple `json` objects to us. If we are careful, we will be able to use
this same API later, and won't have to rewrite our code.

Let's get back to the root of our project folder

```
$ cd ../
```

and now let's make ourselves a server file

```
$ touch server.js
```

While we are here, let's create a few things we'll use in the future. First we'll make a folder to store our route files. This will be the place that we implement access to the data models we make. If this sounds confusing, just hang with me. We'll go over it more when we make the actual routes.

```
$ mkdir routes
```

Next let's make two directories to store views for our project. The parent folder - `views` - will act as a storehouse for all of our top level views, like `index.html`, `layout.html`, `posts.html`, etc. The `partials` folder will allow us to break up these views into smaller, easier to edit and maintain, pieces.

```
$ mkdir -p views/partials
```

Now we will make a folder to store our static content. This will be things like `css` files, or client-side `JavaScript` libraries.

```
$ mkdir public
```

While we won't use some of these folders immediately, they will be nice for us
to have in place as we go along.

Let's install express

```
$ npm install --save express
```

[Express](http://expressjs.com/) is a web application framework for `node` and
it is incredibly powerful.

Let's grab something else we want to work with it.

```
$ npm install --save body-parser
```

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
By now, at least some of this code will look familiar. The `require()` statements just mean that we are including files that we need to make our app run, `var app = express()` is just setting `app` to be the result of `experss()`. Next up we have something new, and that is `app.set`. Here we are telling express that we want to set different properties - in this case `dbhost` and `dbname` - to equal the next value we provide. It is essentially a key-value store that we are accessing.

Next up is `mongoose.connect` this is just telling our application where our database lives, and what we want to use as a name for it. This uses the values we setup on the previous lines.

The next new bit of code we see is `bodyParser`. This is used to allow specific types of requests (think form data) to be handled by the server. Here we are allowing json requests, and urlencoded data.

Last, but not least is our `var server` which is actually what starts up our express server, and selects what port, and ip address to listen on. Again, here we are using values we set earlier, but you could also pass the numbers in manually here.

Let's see if our server starts... *hint: make sure mongod is running first or you will get an error.*

```
$ node server.js
```

This will produce the console message
`Chronicle has started...`
or whatever message you put into your `console.log`. If you do that means your application is running without errors! Lets try and talk to it...

```
$ curl http://127.0.0.1:8081
```

which results in...

```
Cannot GET /
```

This means our server **is** running, but since we haven't defined any routes for it to use yet, it doesn't know how to answer our request, so it simply returns a default error message.

#### Routing
So what can we do about that pesky error message above? Write a route to take care of that path of course! If you remember, we [earlier](#installing-express) created a folder called `routes` that we said would hold all the files for routes in our application. What is a route exactly? It's a path that is attached to a url. Let's use this GitHub repo as an example. The domain that it lives at is `https://github.com`, which by default loads up a route you have now seen, known as `/`. That page is either github's home page, or a user specific dashboard/feed, depending on if you are logged in or not. Now this repository lives at a specific route off of github's primary domain. That route is `/NathanBland/Chronicle`. If you combine this with the primary domain, it looks exactly like the URL in your browser. Github has structured their route so that each repository lives under its creating user. This allows them to make their urls friendly, while still allowing multiple users to have repositories with the same name. Whew, that was a lot. Let's make some routes!

##### File structure
Now, let's move to that folder called routes, and see what we need to make.

```
$ cd routes/
```

At present, this directory is empty. Let's change that.

```
$ touch index.js
```

We will use this file to easily maintain what routes are being used by the application, and it will make including them in our `server.js` file much easier.

```
$ mkdir -p api/v1
```

###### Making our route index
Since we are working with accessing data right now, we aren't going to be working with a lot of typical front-end visible routes just yet. Creating this folder is basically helping us keep track of our own code, while establishing a method to support older versions of our own system. Now, let's setup our `index.js` file.

Open up `index.js`

```javascript
var express = require('express')
exports.setup = function (app) {
  var router = express.Router()

  var v1 = require('./api/v1')

  router.use('/api/v1', v1.setup(app))

  return router
}
```

Awesome. So here we are including express, which is what we use for establishing routes. We then create a function as part of the `exports` object that takes in our express app as a parameter. We declare our `var router` to be one provided by express. Then we say we want to require `./api/v1`. This is saying to look in the current directory, then drill down into api, and then v1 to look for a route file. *We still need to create an index file at that location.* Next, and very importantly, we tell our `router` to `.use` the result of the `v1.setup(app)` function. We also specify a path/route `/api/v1` for it to use. This means that `/api/v1` will now be considered the root for all routes within this directory. This makes our route files cleaner, and easier to maintain. This is a function we still have to build, but it is how we will export our routes from one file to another. *There are several ways to do this, but for the sake of consistency I will use this method throughout the guide.* Next we return our router, which will send it back up to the file - `server.js` in this case - that is including it.

###### Creating the API index
Next we need to establish our API `index.js` file that we already referenced in our primary `index.js` file. To do this, let's head back to command line.

```
$ touch api/v1/index.js
```

Let's open up that new file, and write some code. You'll notice this will look very similar to our previous index, with some minor, but key differences.

*It should be noted that there are many ways you could proceed from here. I'm taking one approach for this project based on an approach to present something consistent. This may not be the best way, but for our application it makes sense.*

```javascript
var express = require('express')
exports.setup = function (app) {
  var router = express.Router()

  var users = require('./user')

  router.use('/user', users.setup(app))

  return router
}
```

In this file, we are setting up what resource routes we want to be accessible. Since a user is currently our only resource available, it is the only route we establish. The rest of this file is nearly identical to the previous index.

Now let's make that user file we just required.

##### Making Our User Route
```
$ touch api/v1/user.js
```

Let's open that file up. We are going to do this one in sections.

```javascript
var express = require('express')
var User = require('../../../models/User')

exports.setup = function (app) {
  var router = express.Router()

  return router
}

```

So far, there isn't a lot of new content here. We are including our user model, including express, and setting up another routing function.

Now place this next section of code *inside* that function, below the `var router` declaration, but before `return router`.

```javascript
router.route('/')
  .get(function (req, res, next) {
    User.find({}, '-_id')
      .limit(10)
      .sort({
        _id: -1
      })
      .select({
        username: 1
      })
      .exec(function (err, users) {
        if (err) {
          console.warn('err:', err)
          return res.status(500).json(err)
        }
        return res.status(200).json(users)
      })
  })

```

Wow. Let's go at this bit by bit. First we are establishing a new route that responds to requests on the `/` route. Remember, because of where we are that is *acutally* `/api/v1/user`. Next, we are saying we want to answer requests to that url that are of the `GET` type. Each of these requests will have three properties that we can use in our routes. Those are `req`, `res`, and `next`. We won't get into `next` a lot in this guide, but it is powerful.

Now, once we have received a `get` request on our route `/` we want to do something with it. Since this is just `/` and there is no username specified we will return a list of users. That's where our `User.find()` comes in. This is a mongoose function, which is what we used to create our database models.

*You can read more about the built in functions of mongoose [here](http://mongoosejs.com/docs/)*

What we do with this statement, is look for all users `user.find({})` and specify that we don't want to return the `_id` property `'-_id'`. Next we limit the amount of results to show to 10, `.limit(10)`, then sort by the `_id` property `.sort({ _id: -1})` this should return them from newest to oldest. After this we state that we really only want to see the `username` property `.select({ username: 1})`. Now we execute the query we have built up `.exec(function (err, users))`. Once we have the results from our database we can return the results to the client that made the request `return res.status(200).json(users)`. This will give the client a status code of `200: OK` and will also return a json document with the results, `users`.

###### Adding a User
Now, let's add a bit to that. One line below the closing `}` of our `.get` function, we'll add our route that allows us to add a user.

```javascript
.post(function (req, res, next) {
  var user = req.body.username
  if (!user) {
    return res.status(400).json({
      'error': 'No Username specified'
    })
  }
  User.findOne({
    username: user
  })
    .exec(function (err, oldUser) {
      if (err) {
        console.warn('err:', err)
        return res.status(500).json(err)
      }
      if (oldUser) {
        console.log('username already exists')
        return res.status(400).json({
          'error': 'That username already exists'
        })
      } else {
        var newUser = User()
        newUser.username = user
        newUser.save(function (err) {
          if (err) {
            console.warn('err:', err)
            return res.status(500).json(err)
          } else {
            return res.status(201).json(newUser)
          }
        })
      }
    })
})
```

You'll notice we do a lot of the same type of operations in this route, as we did on the `.get`. We still look for a user, only this time, we pass in a name to look for. We've also set our route to listen on a `.post` instead of a `.get`. One new bit of code, is the `newuser.save` function we are using. All this is doing, is saving the new user that we have created back to the database, then returning the result to the user. We also have a check above this to see if the username exists in our database already. Normally with mongoose you could do this simply off of a `.save()`, but since we do not have our username set to be unique, that isn't the case. We have done this to allow for future logins from 3rd party providers like twitter, but that isn't in place yet.

Now let's add a route to **only** get the information of one user. We'll add this before our `return router` statement, but after the end of our `.post`.

```javascript
router.route('/:username')
  .get(function (req, res, next) {
    var username = req.params.username
    if (!username) {
      return res.status(400).json({
        'error': 'No Username specified'
      })
    }
    User.findOne({username: username}, '-_id')
      .exec(function (err, user) {
        if (err) {
          console.warn('err:', err)
          return res.status(500).json(err)
        } else {
          return res.status(200).json(user)
        }
      })
  })

```

There is one new addition here, and that is `req.params.username`. This is referencing `/:username` that we define in our route. Again, because of the file we are in, that really is `/api/v1/user/:username`. All that this `username` parameter does, is allow us to put a name into the route and be able to access that value, such as `/api/v1/user/Jimmy`. This would then return the results for the user `Jimmy` if it exists, or return an error.

Now that we have basic routes for the User model defined, we can almost try it out. Before we do, we have to `require` our primary `index.js` file in our `server.js` file.

To do this, let's open up `server.js`:

Just below the `var mongoose` statement, let's include our routes.

```javascript
var routes = require('./routes/')
```

Now we can configure our express app to use it. Add a new line above `var server`.

```javascript
app.use(routes.setup(app))
```

Save all of your files, its time to test that user.

First let's see what users we have:

```
$ curl localhost:8081/api/v1/user/
```

Currently, this returns a blank array, which is fine, we don't have any users yet! Now, add one.

```
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"Jimmy"}' http://localhost:8081/api/v1/user
```

This results in a result of

```
{"__v":0,"username":"Jimmy","_id":"560c2d8ae58168994e6e4af3"}
```

Your `_id` value will be different, which is fine.

Now let's try and get that user:

```
$ curl localhost:8081/api/v1/user/Jimmy
```

which gives us:

```
{"username":"Jimmy","__v":0}
```

Fantastic! We can now create, and get users!

Next up will be adding journal entries to each user.

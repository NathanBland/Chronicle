# Chronicle
A repository that aims to instruct usage of basic building blocks of `node.js`, `express`, `mongodb`, `mongoose`, and authentication with `passport`.

## Introduction
There is a lot going on in the JavaScript world, and a lot of it can be overwhelming to take in.
This repository aims to act as a guide to instruct those who may be new to this wonderful world
and hopes to advise some best practices along the way.

To do this we will be creating a journal application. It will have multiple users, and it will allow each of these users to Create, Read, Update, & Delete entries, also known as a `CRUD` application. It will do this in a REST-ful manner.

To create a solid base for this project, we'll start off with data modeling and progress to an API to access that data. This will give us a solid understanding of what we are accessing, and avoid writing code that will be discarded later.

## Getting Started

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

## Cooking With Gas

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
So what can we do about that pesky error message above? Write a route to take care of that path of course! If you remember, we [earlier](#installing-express) created a folder called `routes` that we said would hold all the files for routes in our application. What is a route exactly? It's a path that is attached to a url. Let's use this GitHub repo as an example. The domain that it lives at is `https://github.com`, which by default loads up a route you have now seen, known as `/`. That page is either github's home page, or a user specific dashboard/feed, depending on if you are logged in or not. Now this repository lives at a specific route off of github's primary domain. That route is `/NathanBland/Chronicle`. If you combine this with the primary domain, it looks exactly like the URL in your browser. Github has structured their route so that each repository lives under its creating user. This allows them to make their urls friendly (human readable), while still allowing multiple users to have repositories with the same name. Whew, that was a lot. Let's make some routes!

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
exports.setup = function (app, express) {
  var router = express.Router()

  var v1 = require('./api/v1')

  router.use('/api/v1', v1.setup(app, express))

  return router
}
```

Awesome. So here we are passing in `app`, and `express`, which we will get from our `server.js` file. We pass these into a function we are creating on the `exports` object. We declare our `var router` to be one provided by express. Then we say we want to require `./api/v1`. This is saying to look in the current directory, then drill down into api, and then v1 to look for a route file. *We still need to create an index file at that location.* Next, and very importantly, we tell our `router` to `.use` the result of the `v1.setup(app, express)` function. We also specify a path/route `/api/v1` for it to use. This means that `/api/v1` will now be considered the root for all routes within this directory. This makes our route files cleaner, and easier to maintain. This is a function we still have to build, but it is how we will export our routes from one file to another. *There are several ways to do this, but for the sake of consistency I will use this method throughout the guide.* Next we return our router, which will send it back up to the file - `server.js` in this case - that is including it.

###### Creating the API index
Next we need to establish our API `index.js` file that we already referenced in our primary `index.js` file. To do this, let's head back to command line.

```
$ touch api/v1/index.js
```

Let's open up that new file, and write some code. You'll notice this will look very similar to our previous index, with some minor, but key differences.

*It should be noted that there are many ways you could proceed from here. I'm taking one approach for this project based on an approach to present something consistent. This may not be the best way, but for our application it makes sense.*

```javascript
exports.setup = function (app, express) {
  var router = express.Router()

  var users = require('./user')

  router.use('/user', users.setup(app, express))

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
var User = require('../../../models/User')

exports.setup = function (app, express) {
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
app.use(routes.setup(app, express))
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

### Journal entries
Now we need to let our users actually create content. In the context of this project, that means giving the ability to make journal entries, save them, modify them, and delete them, if they so wish. Let's take a quick look at what we will be working with in this section.

Files:
  - `models/Journal.js`
    - We will create this file.
    - Its purpose will be to store journal entries for each user.
  - `models/User.js`
    - We will modify this file.
    - Its purpose will be to create a function to find entries per user.
  - `routes/api/v1/journal.js`
    - We will create this file.
    - Its purpose will be to allow our C.R.U.D. operations on each entry.
      - `Create`, `Read`, `Update`, `Delete`
  - `routes/api/v1/index.js`
    - We will modify this file
    - This file must have the `journal.js` file added to it so that our application can see the routes.

Now that we have established what we will be working with, let's get to it.

#### Data model
Given the previous model we created, `User.js`, there won't be very much new code in this model, but what differences there are, I will cover.

Let's make our file. *If you aren't already there, move to the models directory*

```
$ touch Journal.js
```

After we make the file, let's open it up.

```javascript
var mongoose = require('mongoose')

var Journal = mongoose.Schema({
  title: String,
  content: String,
  alias: String,
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    index: true
  }
})

module.exports = mongoose.model('journal', Journal)

```

A lot of the code above is similar to the user schema we created previous. Now you may be saying... *What's that funny looking `user_id` property, and what is up with that `default: Date.now` property?* Great Question, I'm glad you asked. the `default: Date.now` simply means that when we create an object we don't have to worry about creating a date to pass into it. All we have to do is make the object, and those values will be populated by our model automatically. As for the `user_id` property, this is what will let us link our user model to our journal model. When we create an entry, we'll pass in the `_id` of a user, which will help us do queries based on user.

Awesome, we have our entries, let's make a way to access them!

Let's open `User.js`

```javascript
var Journal = require('./Journal')
//...Snipped
User.methods.getEntries = function (callback) {
  return Journal.find({
    user_id: this._id
  }, callback)
}
```

`var journal` I added right below `var mongoose` and `User.methods` I added after defining the `var User` schema. This function is setup to find all journal entries that match our current user's `_id`. *We won't use this as much until we have authentication in place, but we are adding it now to make our lives easier later.*

Now let's make routes.

#### Routing
Routing works in a different area than our models, so let's move over there:

```
$ cd ../routes/api/v1
```

##### Modifying the API Index
First we will include our new route in our `index.js` file, so let's open that:

```javascript
var journal = require('./journal.js')
//...Snipped
router.use('/entry', user.setup(app, express))
```

This is the only code we need to add to this file. I put mine in a similar fashion to how the `user` route was already setup.

Now let's make our new routing file:

```
$ touch journal.js
```

Easy enough, now let's open it:

##### Route: `/user/:user`
Details:
- Full Path: `/entries/user/:user`
- Example: `/entries/user/mike`
- Purpose: Allow creation of new entries for a user, and list existing entries for a user.
- CRUD methods implemented:
  - Creation using `post`
  - Reading using `get`
  - Update not valid for this path
  - Delete not valid for this path

```javascript
var Journal = require('../../../models/Journal')
var User = require('../../../models/User')

exports.setup = function (app, express) {
  var router = express.Router()
  router.route('/user/:user/')
  .get(function (req, res, next) {

  })
  .post(function (req, res, next) {

  })

  return router
}

```

This is what I'm going to start with for this route. You'll notice I include both the `Journal` and `User` models. That's because this route will need access to both.

###### The `get` Route
Details:
- Full path: `/entries/user/:user`
- Example: `/entries/user/mike`
- Purpose: list all of the entries for that particular user.
- Restrictions:
 - Should not function for user `anon`.


```javascript
.get(function (req, res, next) {
  if (req.params.user === 'anon') {
    res.status(400).json({
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
```

Ok, so a bit of new code here. You can see we look for the user off of what was passed in from the route, if we find one, we then call the function we made earlier to grab all the entries for us. Then we sort by date last updated, and return the list in json format.

###### The `post` Route
Details:
- Full path: `/entries/user/:user`
- Example: `/entries/user/mike`
- Purpose: list all of the entries for that particular user.
- Restrictions:
  - None.

```javascript
.post(function (req, res, next) {
  if (!req.body.content || req.body.content === '') {
    return res.status(400).json({
      'error': 'Content can not be blank!'
    })
  }
  var entry = new Journal()
  var alias = ''
  if (req.body.title) {
    alias = req.body.title.toLowerCase().replace(' ', '-')
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
  } else if (req.params.user && req.params.user !== '') {
    User.findOne({username: req.params.user}, function (err, user) {
      if (err) {
        return res.status(400).json({
          'error': 'Invalid username.'
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
  }
})
```

I know, I know. I just gave you a lot of code to chew on. Just hang with me. We start this route out by checking to make sure there is actually some content to save, because we don't want to allow blank entries. After we have made sure of that, we create a new entry. So far so good. Then we check to see if our user was kind enough to set a title, if they weren't, we grumble a little, and make one for them, using a time stamp. We use a safe version of this string as an alias to create a somewhat friendly URL for our user to read.

Next we do a check to see if our user is `anon` or not. If they are (so not logged in) we create our entry without a user_id property, because well, they don't have one. If they do have one, we create that entry with their user_id after going and looking for it. This will be a better process in the UI version of this, but in an API, where authentication is mostly done with a token, we won't have the user object being given to us, so we have to go get it. Right now, we are doing that with the username. After our object is setup, we save it, and return the result back to the client in `json` format. See, it wasn't that bad was it? (Don't answer that)

##### Route: `/user/:user/entry/:entry`
Details:
- Full Path: `/entries/user/:user/entry/:entry`
- Example: `/entries/user/mike/entry/Sunny-day-2015-10-05T19:45:54.788Z`
- Purpose: Allow reading, updating, and deleting of a specific entry for a user.
- CRUD methods implemented:
  - Creation not valid for this path
  - Reading using `get`
  - Update using `put`
  - Delete using `delete`

```javascript
router.route('/user/:user/entry/:entry')
  .get(function (req, res, next) {

  })
  .put(function (req, res, next) {

  })
  .delete(function (req, res, next) {

  })
```

Above is the framework for our new route. As you can see, we don't have a `post` method on this route, but we do have a `put` and `delete`.

###### The `get` Route
Details:
- Full Path: `/entries/user/:user/entry/:entry`
- Example: `/entries/user/mike/entry/Sunny-day-2015-10-05T19:45:54.788Z`
- Purpose: list a single entry for that particular user.
- Restrictions:
  - None

```javascript
router.route('/user/:user/entry/:entry')
  .get(function (req, res, next) {
    if (!req.params.user || !req.params.entry) {
      return res.status(400).json({
        'error': 'No Username or entry specified'
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
```

Compared to the `get` route for the list of entries, this is pretty much the same. the only difference is that we look for a specific user_id on each entry, which is a minor change from the previous code, and we are only searching for one entry, instead of multiples.

###### The `put` Route
Details:
- Full Path: `/entries/user/:user/entry/:entry`
- Example: `/entries/user/mike/entry/Sunny-day-2015-10-05T19:45:54.788Z`
- Purpose: Update a select entry with changes submitted from the client
- Restrictions:
  - `anon` does not have permission to use this route.

```javascript
.put(function (req, res, next) {
  if (!req.params.user) {
    return res.status(400).json({
      'error': 'No user specified!'
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

```
Some new bits of code in this route include `findOneAndUpdate`, this is documented [here](http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate) and is very, very helpful for us. We also carefully create an object with just the properties we know have been submitted, and send those off to be applied as an update to our record.

This is essentially like the `post` route we made for the previous route, but modifies an existing entry, instead of creating a new one.

###### The `delete` Route
Details:
- Full Path: `/entries/user/:user/entry/:entry`
- Example: `/entries/user/mike/entry/Sunny-day-2015-10-05T19:45:54.788Z`
- Purpose: Deletes a select entry for a user.
- Restrictions:
  - `anon` does not have permission to use this route.

```javascript
.delete(function (req, res, next) {
  if (!req.params.user) {
    return res.status(400).json({
      'error': 'No user specified!'
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
```

Most of the code in this is the same as in previous routes. Only we don't care about anything other than if there is a user, and the entry alias. We then call `findOneAndRemove` which is documented [here](http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove) and return the result to the client. The `204` status code indicates that the request was processed successfully, bu there is no content to return.

###### Testing
At this point our routes should all be working, and we should be able to add some content to a user, or add it anonymously. We've created a lot of code, so let's go through and make sure that it works.

Go to the root directory (`$ cd ../../../`) and then start our server back up:

```
$ node server.js
```

Now from another terminal, let's query it. If you need to remember what users you have, or if you have any, run this:

```
$ curl localhost:8081/api/v1/user/
```

For me, this returns:

```
[{"username":"mike"},{"username":"Jimmy"}]
```

So I have `mike` and `Jimmy` as users.

Let's see if `mike` has any entries:


```
$ curl localhost:8081/api/v1/entry/user/mike
```

For me, this returns:

```
[]
```

Which makes sense, since we just added the ability to create entries.

Speaking of entries, let's make one:

```
$ curl -H "Content-Type: application/json" -X POST -d '{"title":"Sunny Day", "content": "Just a taste of what is to come"}' http://localhost:8081/api/v1/entry/user/mike
```

For me, this returns:

```
{"__v":0,"title":"Sunny Day","content":"Just a taste of what is to come","alias":"sunny-day-2015-10-05T21:39:46.839Z","user_id":"560c4f465a2568a150f76fc1","_id":"5612ee22dd4befdb7870e66d","updated":"2015-10-05T21:39:46.838Z","created":"2015-10-05T21:39:46.837Z"}
```

So it looks like our creation process works! Let's try to get that entry back using the alias it returned to us: *Remember, your alias will be different from mine*

```
$ curl http://localhost:8081/api/v1/entry/user/mike/entry/sunny-day-2015-10-05T21:39:46.839Z
```

For me, this returns:

```
{"title":"Sunny Day","content":"Just a taste of what is to come","alias":"sunny-day-2015-10-05T21:39:46.839Z","user_id":"560c4f465a2568a150f76fc1","__v":0,"updated":"2015-10-05T21:39:46.838Z","created":"2015-10-05T21:39:46.837Z"}
```

Which means that it worked! Awesome. Let's try to update that entry.

```
$ curl -H "Content-Type: application/json" -X PUT -d '{"title":"Cloudy Day"}' http://localhost:8081/api/v1/entry/user/mike/entry/sunny-day-2015-10-05T21:39:46.839Z
```

For me, this returned:

```
{"_id":"5612ee22dd4befdb7870e66d","title":"Sunny Day","content":"Just a taste of what is to come","alias":"sunny-day-2015-10-05T21:39:46.839Z","user_id":"560c4f465a2568a150f76fc1","__v":0,"updated":"2015-10-05T22:05:43.790Z","created":"2015-10-05T21:39:46.837Z"}
```

Which actually looks a little off. Let's try grabbing that record and see what it says:

```
$ curl http://localhost:8081/api/v1/entry/user/mike/entry/sunny-day-2015-10-05T21:39:46.839Z
```

For me, this returned:

```
{"title":"Cloudy Day","content":"Just a taste of what is to come","alias":"sunny-day-2015-10-05T21:39:46.839Z","user_id":"560c4f465a2568a150f76fc1","__v":0,"updated":"2015-10-05T22:05:56.877Z","created":"2015-10-05T21:39:46.837Z"}
```

So our update DID happen, but the `findOneAndUpdate` did not give us back the new record, it gave us the *old* one back. We will look at addressing this later, as we will probably want to just return a status code acknowledging the change has been made, and not return the new object. However, our code does work, so we will leave it alone. *For Now*

Now let's try to remove that same entry:

```
$ curl -H "Content-Type: application/json" -X DELETE http://localhost:8081/api/v1/entry/user/mike/entry/sunny-day-2015-10-05T21:39:46.839Z
```

For me, this returns nothing. Which isn't great for our user experience, however attempting to access the entry again produces this:

```
$ curl http://localhost:8081/api/v1/entry/user/mike/entry/sunny-day-2015-10-05T21:39:46.839Z

null
```

So our entry was removed, but we weren't notified.

Try the same tests again, but with `anon` as a user.


Next up will be authentication, then a user interface!

### Authentication
Let me just be honest. Usually in creating web applications, authentication is one of the hardest parts. It can be extremely difficult to do well, and it can be even harder once you look at integrating other providers (Facebook, Twitter, Google, etc.). Node.js by itself does not remedy this problem, but it does have a few packages provided by `npm` that make it much, much easier.

Enter [`passport`](http://passportjs.org/). Passport is a library built for node.js that makes authentication so much easier in applications that it can be accomplished in a few short lines. However, we are building an API, and most of passport's authentication strategies - methods of authentication - are built for session based authentication using things like cookies. We would prefer to avoid this if we can because cookies do not work well with API calls. Fortunately for us, there is something called `jwt` or [JSON web tokens](http://jwt.io/). According to `jwt.io` JSON web tokens are described as > JSON Web Tokens are an open, industry standard [RFC 7519](https://tools.ietf.org/html/rfc7519) method for representing claims securely between two parties.

Now that's all fine and good, but what does that actually mean for us? It means that we can authenticate users with a token, originally issued by the server, instead of relying on a cookie. This means that users of the API can pass along this token with their requests and be authenticated just like they had a session. Setting this up can be a bit tricky, but we'll do our best to keep it as simple as possible.

We'll be working with several new files in this section, so if I missed one in this overview, forgive me, open an issue, and I'll fix it.

Files:
  - `routes/api/v1/index.js`
    - We will modify this file.
    - We will do this to add our authentication routes to the application API.
  - `models/User.js`
    - We will modify this file.
    - We will do this to add our authentication routes to the application API.
  - `routes/api/v1/authentication`
    - We will create this folder.
    - Its purpose is to store all the new files for authentication.
  - `routes/api/v1/authentication/index.js`
    - We will create this file.
    - Its purpose will be to index all of our authentication methods.
  - `routes/api/v1/authentication/local.js`
    - We will create this file.
    - Its purpose will be to authenticate local users to our application.

It should be noted that there are many ways to organize your authentication routes. I'm choosing to do by provider, but you could also store strategies in one file, and routes in another. I am using this method to show what routes relate to a particular authentication strategy, as I believe it is a better way to show that relation.

First let's make the folder we will house our authentication files. *You should still be at the root directory of our application at this point.*

```
$ mkdir routes/api/v1/authentication
```

Before we get on to making our routes and strategies for our authentication, we need to add our new path to our application index.

open `routes/api/v1/index.js` and add your authentication like you have with entry and user.

```javascript
var auth = require('./authentication')
// snipped
router.use('/auth', auth.setup(app, express))

```

I added mine above the previous entries to ensure authentication is initialized before the rest of the routes.

#### Authentication Strategy
So what is a authentication strategy? It's a method for authentication. A traditional approach is to use an email and password to login, a newer approach is to use a third party provider (such as twitter) to login the user, and then have that provider return a token of some kind verifying that particular user is who they say they are.

`passport` is what we will be using to setup our strategies, which means we need to install it. We'll also need something called `jwt-simple` which is a library for using [JSON Web Tokens](http://jwt.io).

```
$ npm install --save passport passport-local passport-local-mongoose passport-http-bearer jwt-simple
```

Let's quickly go over what each of these contains.

- `passport`
  - is the base package and contains core components of passport.
- `passport-local`
  - contains methods specific to a local strategy (storing a username and password locally)
- `passport-local-mongoose`
  - A little plugin that makes our lives much easier in terms of data modeling.
- `passport-http-bearer`
  - This module will be what we use to verify our tokens.
- `jwt-simple`
  - Library for generating, encoding, and decoding `jwt`.

Now let's implement passport in our `User.js` data model.

Open `models/User.js`:

```javascript
// snipped
User.plugin(require('passport-local-mongoose'))
// snipped
```

That's all. For reference I have mine before the user methods, but you can put it anywhere after the `User` object is defined, as long as it is before `module.exports`.

Now we can safely work in our `authentication` folder, and not have to mess with outside forces (yet).

```
$ cd routes/api/v1/authentication
```

Let's make our index:

```
$ touch index.js
```

And our basic strategy:

```
$ touch local.js
```

Now let's setup our index:

```javascript
exports.setup = function (app, express) {
  var router = express.Router()

  var local = require('./local.js')

  router.use('/local', local.setup(app, express))

  return router
}

```

This file is looking very familiar at this point. Just including a file we want to be part of our greater application at a specific URL.

Now let's open `local.js`

```javascript
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
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
        return done(null, true)
      } catch (err) {
        return done(null, false)
      }
    }
  ))
  passport.use(new LocalStrategy(User.authenticate()))

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

```

This file's contents are pretty new, so let's take time to look at them. First our includes:

```javascript
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy
var jwt = require('jwt-simple')
var tokenSecret = 'a really awful secret'
var User = require('../../../../models/User.js')

```

First we grab `passport`, `passport-local`, and `passport-http-bearer`. These make our authentication crazy easy.

Next up is `jwt-simple`, which let's us create those tokens we talked about already. Right after it we create a secret to be used with our token, and then grab our user.

*If we were implementing multiple providers (which we will in the advanced section) we would move the `tokenSecret` to our `index.js` file so that we could share it between those providers while only creating it once.*

The next code `exports.setup` is not new, and I won't cover it.

```javascript
passport.use(new BearerStrategy(
  function (token, done) {
    try {
      var decoded = jwt.decode(token, tokenSecret)
      console.log(decoded)
      return done(null, true)
    } catch (err) {
      return done(null, false)
    }
  }
))
passport.use(new LocalStrategy(User.authenticate()))
```

Now this *is* new. Ok, first we are establishing a `Bearer` strategy, this is what will authenticate our tokens once we have created them. We are passing it into `passport` so that it knows how to handle that type of authentication.

After this we create a `local` strategy for passport to use as well. This relates to that `passport-local-mongoose` plugin we setup in our user model. This has built in methods to find a user, compare the password hash for us, and return the result. Its pretty neat.

#### Authentication Routes
Next up we have two routes. Let's handle the `/register` route first:

```javascript
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
```

This is like our own user create route we have in `user.js`, but this one expects a password. The `.register` is a built in method given to us by `passport-local-mongoose`. Next we see `passport` really being put to good use. It authenticates our new user for us (how nice of it), sets a session store to `false` (we are using tokens), and returns our authenticated user if there is one. Inside of this, we create a `jwt` token to send to the user. We use the `tokenSecret` we established above, and also pass along the user id, and username. Good for us!

*Later, to make this more secure, we'll also add an expiration date.*

Next we get to our `/login` route.

```javascript
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

```

Despite this code appearing to have a lot going on, it doesn't. First we say we want to authenticate with the `local` strategy we defined above. Then we disable sessions because we are using tokens. This is just an option that can be passed in to `passport`. Finally, we give it our callback function. This takes a request, and response, which we name `req` and `res`. Now we create our token using `jwt`, and give the user id, and username to the token body. Remember, passport took care of checking the user details for us already. After we build the token, we pass it back to the user. Great! These routes should now function, meaning you can call them, and get a token back. *Now its important to know that none of our existing users will be able to login, as they dont' have a password hash set.*

#### Testing
Let's try it out.

```
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"slim", "password": "sample"}' http://localhost:8081/api/v1/auth/local/register
```

For me, this returns:

```
{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2MWQ0ODcxNzJhMWI1M2U0ZDMwOWFjYiIsInVzZXJuYW1lIjoic2xpbSJ9.ZQt8iWRf8_OkCBkk5EjrpYzN11pTpD7_0FU8NiarHYc"}
```

Great so we are getting a token, let's try logging in with that same user:

```
$ curl -H "Content-Type: application/json" -X POST -d '{"usernme":"slim", "password": "sample"}' http://localhost:8081/api/v1/auth/local/login
```

Which for me gives:

```
{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2MWQ0ODcxNzJhMWI1M2U0ZDMwOWFjYiIsInVzZXJuYW1lIjoic2xpbSJ9.ZQt8iWRf8_OkCBkk5EjrpYzN11pTpD7_0FU8NiarHYc"}
```

Fantastic, but what happens if we pass the wrong user, or password?

```
$ curl -H "Content-Type: application/json" -X POST -d '{"usernme":"sli", "password": "sample"}' http://localhost:8081/api/v1/auth/local/login
```

```
Unauthorized
```

```
$ curl -H "Content-Type: application/json" -X POST -d '{"usernme":"slim", "password": "sampl"}' http://localhost:8081/api/v1/auth/local/login
```

```
Unauthorized
```
#### Adding Authentication to Routes
Looks good.

Now we have the ability to require authentication on *any* of our routes, we simply have to add a bit of code. For example, I don't want the list of users to be public, I can add this (I added this above `router.route('/')`)

```javascript
router.all('/', passport.authenticate('bearer', { session: false }))
```

to `routes/api/v1/user.js` in addition to including passport
```javascript
var passport = require('passport')
```
This makes A user pass in a token on the end of the url, like this:

```
$ curl localhost:8081/api/v1/user/?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2MWQyOGQwMjMwYWY3YmM0YTI0NGU0NCIsInVzZXJuYW1lIjoiaGVyby._xv2oXZFfzs37zHkVqy7LqY0EhuUj9GUQO0P91cRis
```

If that token is valid, it will return the list.

Suddenly securing our API is very simple, all we have to do is include passport, and reference our authentication method.

Let's move to `routes/api/v1/journal.js`.

Include passport at the top:

```javascript
var passport = require('passport')
```

Now let's secure those `put` and `delete` routes.

I'm working right below `router.route('/user/:user/entry/:entry')`

```javascript
.put(passport.authenticate('bearer', { session: false }))
.delete(passport.authenticate('bearer', { session: false }))
// ..Snipped
```

Done.

##### More Testing
Let's test it.

First we create an entry for a user:

```
$ curl -H "Content-Type: application/json" -X POST -d '{"title":"Yay Auth", "content": "Authentication makes things great!"}' http://localhost:8081/api/v1/entry/user/slim
```

*Notice the current flaw in our system. You can create entries without being logged in for a user that requires a password. We will fix this later.*

```
$ curl localhost:8081/api/v1/entry/user/slim
```

Great so we have an entry. Let's try to update it without logging in...

*Remember your alias will be different from mine*

```
$ curl -H "Content-Type: application/json" -X PUT -d '{"title":"Tokens rock!"}' http://localhost:8081/api/v1/entry/user/mike/entry/yay-auth-2015-10-13T19:01:31.140Z
```

For me, this returns

```
Unauthorized
```

Which is exactly what we want. What happens if we pass our authentication token along side it?

```
$ curl -H "Content-Type: application/json" -X PUT -d '{"title":"Tokens rock!"}' http://localhost:8081/api/v1/entry/user/mike/entry/yay-auth-2015-10-13T19:01:31.140Z?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2MWQ0ODcxNzJhMWI1M2U0ZDMwOWFjYiIsInVzZXJuYW1lIjoic2xpbSJ9.ZQt8iWRf8_OkCBkk5EjrpYzN11pTpD7_0FU8NiarHYc
```

For me, this returns the result without error! Awesome!

##### Securing POST for entries
Now what about the pesky fact that a user, that isn't `anon` can create a post under any username they want? We can remedy that!

Starting right after `else if (req.params.user && req.params.user !== '')`:

```javascript
passport.authenticate('bearer', {session: false})(req, res, next)
```

What we are doing here, is telling passport to try and authenticate the user, and then forward the request on if it is authorized. Otherwise, it dies.

Now let's try to make an article again without proper permission:

```
$  curl -H "Content-Type: application/json" -X POST -d '{"title":"Test", "content": "Authentication makes things great!"}' http://localhost:8081/api/v1/entry/user/slim

```



.

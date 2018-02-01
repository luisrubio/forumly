const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Topic = require("./models/topic");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require('./seeds');


mongoose.connect("mongodb://lulu:lulu@ds263847.mlab.com:63847/teriyakirubi");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "this is a secret message",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

// **********************
// Topics route
// **********************

// INDEX
app.get("/topics", (req, res) => {
  // get topics from DB
  Topic.find({}, function(err, allTopics){
    if(err){
      console.log(err);
    } else {
      res.render("topics/index", {topics:allTopics});
    }
  });
});

// NEW
app.get("/topics/new", (req, res) => {
  res.render("topics/new");
});

// CREATE
app.post("/topics", (req, res) => {
  // get data from form and add to topic array
  const title = req.body.title;
  const body = req.body.body;
  const image = req.body.image;

  const newTopic = {title: title, body: body, image: image};

  // create a new topic and save to db
  Topic.create(newTopic, function(err, newlyCreatedTopic){
    if(err){
      console.log(err);
    } else {
      // redirect to topic index
      res.redirect("/topics");
    }
  });
});

// SHOW
app.get("/topics/:id", (req, res) => {
  Topic.findById(req.params.id).populate("comments").exec(function(err, foundTopic){
    if(err){
      console.log(err);
    } else {
      res.render('topics/show', {topic: foundTopic});
    }
  });
});

// **********************
// comments route
// **********************

app.get("/topics/:id/comments/new", isLoggedIn, (req, res) => {
  // find topic by id
  Topic.findById(req.params.id, (err, topic) => {
    if(err) {
      console.log(err);
    } else {
      res.render("comments/new", {topic: topic});
    }
  })
});

app.post("/topics/:id/comments", isLoggedIn, (req, res) => {
  // find topic by id
  Topic.findById(req.params.id, (err, topic) => {
    if(err){
      console.log(err);
      res.redirect("/topics");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
        } else {
          topic.comments.push(comment._id);
          topic.save();
          res.redirect("/topics/" + topic._id);
        }
      });
    }
  });
});

// **********************
// auth route
// **********************

// show register form
app.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up
app.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/topics");
    });
  });
});

// show login form
app.get("/login", (req, res) => {
  res.render("login");
});

// handle Login
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/topics",
    failureRedirect: "/login"
  }), (req, res) => {
});

// handle logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/topics");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

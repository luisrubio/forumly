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

const indexRoutes = require("./routes/index");
const commentRoutes = require("./routes/comments");
const topicRoutes = require("./routes/topics");

mongoose.connect("mongodb://lulu:lulu@ds263847.mlab.com:63847/teriyakirubi");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

// passport config
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

// require routes
app.use(indexRoutes);
app.use("/topics/:id/comments", commentRoutes);
app.use("/topics", topicRoutes);

app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

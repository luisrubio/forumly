const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Topic = require("./models/topic");
const Comment = require("./models/comment");
const seedDB = require('./seeds');

mongoose.connect("mongodb://lulu:lulu@ds263847.mlab.com:63847/teriyakirubi");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});


seedDB();

// Topics Schema Setup


// **********************
// Topics route
// **********************

// INDEX
app.get("/topics", (req, res) => {
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

app.get("/topics/:id/comments/new", (req, res) => {
  // find topic by id
  Topic.findById(req.params.id, (err, topic) => {
    if(err) {
      console.log(err);
    } else {
      res.render("comments/new", {topic: topic});
    }
  })
});

app.post("/topics/:id/comments", (req, res) => {
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
app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Topic = require("./models/topic");
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
app.get("/topics/new", function(req, res){
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

app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

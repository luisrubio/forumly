const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// Topics Schema Setup
const topicSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String
});

const Topic = mongoose.model("Topic", topicSchema);

// Topic.create(
//   {
//     title: 'Topic2',
//     body: 'This is the main thing the person says.',
//     image: 'https://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/250px-025Pikachu.png'
//   }, function(err, campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Created");
//     }
// });

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
  Topic.findById(req.params.id, function(err, foundTopic){
    if(err){
      console.log(err);
    } else {
      res.render('topics/show', {topic: foundTopic});
    }
  });
});

app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

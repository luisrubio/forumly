const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");

// INDEX
router.get("/", (req, res) => {
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
router.get("/new", (req, res) => {
  res.render("topics/new");
});

// CREATE
router.post("/", (req, res) => {
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
router.get("/:id", (req, res) => {
  Topic.findById(req.params.id).populate("comments").exec(function(err, foundTopic){
    if(err){
      console.log(err);
    } else {
      res.render('topics/show', {topic: foundTopic});
    }
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("topics/new");
});

// CREATE
router.post("/", isLoggedIn, (req, res) => {
  // get data from form and add to topic array
  const title = req.body.title;
  const body = req.body.body;
  const image = req.body.image;
  const author = {
    id: req.user._id,
    username: req.user.username
  }

  const newTopic = {title: title, body: body, image: image, author: author};

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

// EDIT
router.get("/:id/edit", (req, res) => {
  Topic.findById(req.params.id, function(err, foundTopic){
    if(err){
      res.redirect("/topics");
    } else {
      res.render("topics/edit", {topic: foundTopic});
    }
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  // find and update topic
  Topic.findByIdAndUpdate(req.params.id, req.body.topic, (err, updatedTopic) => {
    if(err) {
      res.redirect("/topics");
    } else {
      res.redirect("/topics/" + req.params.id);
    }
  });
  // redirect to topic
});

// DESTROY
router.delete("/:id", (req, res) => {
  Topic.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/topics")
    } else {
      res.redirect("/topics")
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

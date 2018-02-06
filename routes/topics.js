const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");
const middleware = require("../middleware");

// INDEX
router.get("/", (req, res) => {
  // get topics from DB
  Topic.find({}).sort({'_id': -1}).populate("comments").exec((err, allTopics) => {
    if(err){
      console.log(err);
    } else {
      res.render("topics/index", {topics:allTopics});
    }
  });
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("topics/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
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
  Topic.create(newTopic, (err, newlyCreatedTopic) => {
    if(err){
      req.flash("error", "Something went wrong");
      console.log(err);
    } else {
      // redirect to topic index
      req.flash("error", "Successfully added post");
      res.redirect("/topics");
    }
  });
});

// SHOW
router.get("/:id", (req, res) => {
  Topic.findById(req.params.id).populate("comments").exec((err, foundTopic) => {
    if(err){
      console.log(err);
    } else {
      res.render('topics/show', {topic: foundTopic});
    }
  });
});

// EDIT
router.get("/:id/edit", middleware.checkTopicOwner, (req, res) => {
  Topic.findById(req.params.id, function(err, foundTopic){
    res.render("topics/edit", {topic: foundTopic});
  });
});

// UPDATE
router.put("/:id", middleware.checkTopicOwner, (req, res) => {
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
router.delete("/:id", middleware.checkTopicOwner, (req, res) => {
  Topic.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/topics")
    } else {
      res.redirect("/topics")
    }
  });
});

module.exports = router;

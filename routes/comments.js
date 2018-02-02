const express = require("express");
const router = express.Router({mergeParams: true});
const Topic = require("../models/topic");
const Comment = require("../models/comment");

// NEW
router.get("/new", isLoggedIn, (req, res) => {
  // find topic by id
  Topic.findById(req.params.id, (err, topic) => {
    if(err) {
      console.log(err);
    } else {
      res.render("comments/new", {topic: topic});
    }
  })
});

// CREATE
router.post("/", isLoggedIn, (req, res) => {
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
          // add user info to comment
          comment.author.id = req.user._id;
          comment.author.username =  req.user.username;

          // save comment
          comment.save();
          topic.comments.push(comment._id);
          topic.save();
          res.redirect("/topics/" + topic._id);
        }
      });
    }
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

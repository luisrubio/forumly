const express = require("express");
const router = express.Router({mergeParams: true});
const Topic = require("../models/topic");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
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

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {topic_id: req.params.id, comment: foundComment});
    }
  });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/topics/" + req.params.id);
    }
  });
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/topics/" + req.params.id)
    }
  });
});

module.exports = router;

const Topic = require("../models/topic");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkTopicOwner = (req, res, next) => {
  if(req.isAuthenticated()) {
    Topic.findById(req.params.id, function(err, foundTopic){
      if(err){
        res.redirect("back");
      } else {
        // do they own topic?
        if(foundTopic.author.id.equals(req.user._id)) {
          next();
        // if not owner
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwner = (req, res, next) => {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        // do they own comment?
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        // if not owner
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj;

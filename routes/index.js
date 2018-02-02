const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("index");
});

// show register form
router.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up
router.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/topics");
    });
  });
});

// show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// handle Login
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/topics",
    failureRedirect: "/login"
  }), (req, res) => {
});

// handle logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/topics");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

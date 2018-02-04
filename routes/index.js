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
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome, " + user.username + "!");
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
    failureRedirect: "/login",
    failureFlash: true
  }), (req, res) => {
});

// handle logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/topics");
});

module.exports = router;

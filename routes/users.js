const express = require("express");
const router = express.Router();
const User = require("../models/user");

// SHOW user profile
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err){
      console.log("error");
      res.redirect('/');
    } else {
      res.render('users/show', {user: user})
    }
  })
});

module.exports = router;

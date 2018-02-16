const express = require("express");
const router = express.Router();
// const Topic = require("../models/user");

// SHOW user profile
router.get('/:id', (req, res) => {
  res.render('users/show')
});

module.exports = router;

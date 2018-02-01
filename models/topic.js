const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String
});

module.exports = mongoose.model("Topic", topicSchema);

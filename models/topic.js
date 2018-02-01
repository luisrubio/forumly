const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Topic", topicSchema);

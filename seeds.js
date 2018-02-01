const mongoose = require('mongoose');
const Topic = require('./models/topic');
const Comment = require('./models/comment');

const data = [
  {title: 'Topic1', body: 'BODY1', image: 'https://camo.mybb.com/e01de90be6012adc1b1701dba899491a9348ae79/687474703a2f2f7777772e6a71756572797363726970742e6e65742f696d616765732f53696d706c6573742d526573706f6e736976652d6a51756572792d496d6167652d4c69676874626f782d506c7567696e2d73696d706c652d6c69676874626f782e6a7067'},
  {title: 'PikaPika', body: 'BODY2', image: 'https://camo.mybb.com/e01de90be6012adc1b1701dba899491a9348ae79/687474703a2f2f7777772e6a71756572797363726970742e6e65742f696d616765732f53696d706c6573742d526573706f6e736976652d6a51756572792d496d6167652d4c69676874626f782d506c7567696e2d73696d706c652d6c69676874626f782e6a7067'},
  {title: 'Samus', body: 'BODY3', image: 'https://camo.mybb.com/e01de90be6012adc1b1701dba899491a9348ae79/687474703a2f2f7777772e6a71756572797363726970742e6e65742f696d616765732f53696d706c6573742d526573706f6e736976652d6a51756572792d496d6167652d4c69676874626f782d506c7567696e2d73696d706c652d6c69676874626f782e6a7067'}
];
function seedDB() {
  // Remove all topics
  Topic.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("remove campgrounds");

    // add topics
    data.forEach(function(seed){
      Topic.create(seed, function(err, topic){
        if(err){
          console.log(err);
        } else {
          console.log("addded topic");
          // create comment
          Comment.create({text: 'Awesome!', author: 'Samus'}, function(err, comment){
            if(err) {
              console.log(err);
            } else {
              topic.comments.push(comment._id);
              topic.save();
              console.log("comment added");
            }
          });
        }
      })
    });
  });


}

module.exports = seedDB;

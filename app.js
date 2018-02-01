const express = require("express");
const app = express();
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// **********************
// Topics route
// **********************
var topics = [
  {title: 'Topic1', image: 'https://image.prntscr.com/image/Ob-hRdc_SSq67FClWr5qFw.jpeg'},
  {title: 'Topic2', image: 'https://image.prntscr.com/image/Ob-hRdc_SSq67FClWr5qFw.jpeg'},
  {title: 'Topic3', image: 'https://image.prntscr.com/image/Ob-hRdc_SSq67FClWr5qFw.jpeg'}
];

app.get("/topics", (req, res) => {
  res.render("topics/index", {topics:topics});
});

app.get("/topics/new", function(req, res){
  res.render("topics/new");
});

app.post("/topics", (req, res) => {
  const title = req.body.title;
  const image = req.body.image;
  var newTopic = {title: title, image: image};
  topics.push(newTopic);
  res.redirect("/topics");
});

app.get("/topics/:id", (req, res) => {
  res.render('topics/show');
});

app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

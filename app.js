const express = require("express");
const app = express();


app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render('index');
});

app.get("/topics", (req, res) => {
  var topics = [
    {title: 'Topic1', image: 'https://image.prntscr.com/image/Ob-hRdc_SSq67FClWr5qFw.jpeg'},
    {title: 'Topic2', image: 'https://image.prntscr.com/image/Ob-hRdc_SSq67FClWr5qFw.jpeg'},
    {title: 'Topic3', image: 'https://image.prntscr.com/image/Ob-hRdc_SSq67FClWr5qFw.jpeg'}
  ];
  res.render('topics/index', {topics:topics});
});

app.get("/topics/:id", (req, res) => {
  res.render('topics/show');
});

app.listen(3000, '0.0.0.0', () => console.log("Forumly started."));

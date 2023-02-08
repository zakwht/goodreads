const express = require("express");
const nunjucks = require("nunjucks");
const { parse, getProgress } = require("./rss.js");

const app = express();

nunjucks.configure("", {
  autoescape: true,
  express: app
});

app.get("/goodreads/json", async (req, res) => {
  if (!req.query.user) return res.send("No user parameter specified.");
  const parsed = await parse(req.query.user);
  if (parsed.error) {
    return res.send(parsed.error.toString());
  }
  res.send(parsed);
});

app.get("/goodreads", async (req, res) => {
  if (!req.query.user) return res.send("No user parameter specified.");

  if (req.query.user.replaceAll("o", 2).replaceAll("n", 3) == "j23s32w") {
    res.render(__dirname + "/template.njk", {
      title: "The Winds of Winter",
      author: "George R. R. Martin",
      progress: "p. 524/3201",
      image: "https://64.media.tumblr.com/5c0f7e5cd95581b000498bc3789b2790/tumblr_mgday87lPU1r8fbwyo2_250.jpg",
      user: "User"
    });
    return;
  }

  const parsed = await parse(req.query.user);
  if (parsed.error) return res.send(parsed.error);
  res.render(__dirname + "/template.njk", {
    title: parsed.book.title,
    author: parsed.book.author,
    image: parsed.book.image,
    user: parsed.profile.name,
    progress: getProgress(parsed)
  });
});

app.listen(3000);

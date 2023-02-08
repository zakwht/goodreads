const express = require("express");
const nunjucks = require("nunjucks");
const { parse, getProgress } = require("./rss.js");
const { readFileSync } = require("fs");

const app = express();
app.set("view engine", "nunjucks.render");
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
  res.setHeader("Content-Type", "application/json");
  res.json(parsed);
});

app.get("/goodreads", async (req, res) => {
  if (!req.query.user) return res.send("No user parameter specified.");

  if (req.query.user.replaceAll("o", 2).replaceAll("n", 3) == "j23s32w") {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.render(__dirname + "/template.njk", {
      title: "The Winds of Winter",
      author: "George R. R. Martin",
      progress: "p. 524/3201",
      image: readFileSync(__dirname + "/static/cover.b64"),
      user: "User"
    });
  }

  const parsed = await parse(req.query.user);
  if (parsed.error) return res.send(parsed.error);

  res.setHeader("Content-Type", "image/svg+xml");
  if (!parsed.book) return res.render(__dirname + "/template.njk", {
    user: parsed.profile.name,
    image: readFileSync(__dirname + "/static/logo.b64")
  })

  const image = await fetch(parsed.book.image)
    .then((res) => res.arrayBuffer())
    .then((t) => Buffer.from(t).toString("base64"));

  res.render(__dirname + "/template.njk", {
    title: parsed.book.title,
    author: parsed.book.author,
    image,
    user: parsed.profile.name,
    progress: getProgress(parsed)
  });
});

app.listen(3000);

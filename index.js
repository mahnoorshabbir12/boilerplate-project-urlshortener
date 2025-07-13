require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dns = require("dns");
const url = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/shorturl", function (req, res) {
  let id = Math.floor(Math.random() * 10000);

  if (!/^https?:\/\//.test(req.body.url)) {
    return res.json({ error: "invalid url" });
  }

  const hostname = url.parse(req.body.url).hostname;

  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      console.error(err);
      return res.json({ error: "Invalid URL" });
    }

    res.json({ original_url: req.body.url, short_url: id });
  });
});
app.get("/api/shorturl/:short_url", function (req, res) {
  const short = req.params.short_url;
  const original = urlDatabase[short];

  if (original) {
    return res.redirect(original);
  } else {
    return res.json({ error: "No short URL found" });
  }
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

const path = require("path");

const express = require("express");
const app = express();


app.use("/processed", express.static(path.join(__dirname, '../processed')));
app.use("/public", express.static(path.join(__dirname, './public')));
app.use("/raw", express.static(path.join(__dirname, '../raw')));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/script.js", function(req, res) {
  res.sendFile(path.join(__dirname, "script.js"));
});

app.listen(3000);

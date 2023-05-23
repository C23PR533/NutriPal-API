const express = require("express");
const router = express.Router();
const fs = require("fs");

let upreferences = [];

const readFileData = () => {
  const data = fs.readFileSync("./data/user_preferences.json", "utf8");
  upreferences = JSON.parse(data);
};

readFileData();

const writeFileData = () => {
  const data = JSON.stringify(upreferences, null, 2);
  fs.writeFileSync("./data/user_preferences.json", data, "utf8");
};

router.get("/", (req, res) => {
  res.send(upreferences);
});

router.post("/", (req, res) => {
    upreferences.push(req.body);
    writeFileData();

  res.send(`Saved`);
});

module.exports = router;

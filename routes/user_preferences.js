const express = require("express");
const router = express.Router();
const fs = require("fs");

let upreferences = [];

const readFileData = () => {
  const data = fs.readFileSync("./data/user_preferences.json", "utf8");
  upreferences = JSON.parse(data);
};

readFileData();

router.get("/", (req, res) => {
  res.send(upreferences);
});

module.exports = router;

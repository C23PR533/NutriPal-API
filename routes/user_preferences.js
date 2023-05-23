const express = require("express");
const router = express.Router();

let upreferences = [];

router.get("/", (req, res) => {
  res.send(upreferences);
});

router.post("/", (req, res) => {
  const upreference = req.body;

  const upreferenceWithId = { ...upreference };

  upreferences.push(upreferenceWithId);

  res.send(`${upreference.name}, has been added to the list!`);
});

module.exports = router;

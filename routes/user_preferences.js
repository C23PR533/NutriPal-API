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

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const {
    goals,
    height,
    weight,
    gender,
    birthdate,
    activityLevel,
    disease,
    favoriteFood,
  } = req.body;

  const upreference = upreferences.find(
    (upreference) => upreference.id_user === id
  );

  if (goals) upreference.goals = goals;
  if (height) upreference.height = height;
  if (weight) upreference.weight = weight;
  if (gender) upreference.gender = gender;
  if (birthdate) upreference.birthdate = birthdate;
  if (activityLevel) upreference.activityLevel = activityLevel;
  if (disease) upreference.disease = disease;
  if (favoriteFood) upreference.favoriteFood = favoriteFood;

  writeFileData();

  res.send(`Updated id ${id}`);
});


module.exports = router;

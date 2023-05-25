const express = require("express");
const router = express.Router();
// const fs = require("fs");

router.post("/", async (req, res) => {
  try {
    const id = req.body.id_user;
    const userJson = {
      id_user: req.body.id_user,
      goals: req.body.goals,
      height: req.body.height,
      weight: req.body.weight,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      activityLevel: req.body.activityLevel,
      disease: req.body.disease || [],
      favoriteFood: req.body.favoriteFood || [],
    };
    const response = db.collection("userPreferences").doc(id).set(userJson);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});


// router.patch("/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     goals,
//     height,
//     weight,
//     gender,
//     birthdate,
//     activityLevel,
//     disease,
//     favoriteFood,
//   } = req.body;

//   const upreference = upreferences.find((upreference) => upreference.id_user === id);

//   if (goals) upreference.goals = goals;
//   if (height) upreference.height = height;
//   if (weight) upreference.weight = weight;
//   if (gender) upreference.gender = gender;
//   if (birthdate) upreference.birthdate = birthdate;
//   if (activityLevel) upreference.activityLevel = activityLevel;
//   if (disease) upreference.disease = disease;
//   if (favoriteFood) upreference.favoriteFood = favoriteFood;

//   writeFileData();

//   res.send(`Updated id ${id}`);
// });

// router.delete("/:id", (req, res) => {
//   const { id } = req.params;
//   upreferences = upreferences.filter((upreference) => upreference.id_user !== id);

//   writeFileData();

//   res.send(`Deleted id ${id}`);
// });

module.exports = router;

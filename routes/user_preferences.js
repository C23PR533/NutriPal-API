const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();

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
    const response = await db.collection("userPreferences").doc(id).set(userJson);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const fs = require("fs");
const db = new Firestore();

const path = require("path");
const directoryPath = path.join(__dirname, "data", "foods.json");

router.post("/fromjson", async (req, res) => {
  try {
  const userJson = () => {
    const data = fs.readFileSync(directoryPath, "utf8");
    const jsonData = JSON.parse(data);
    const foodData = jsonData[2];
    const id = foodData.food_id;
    return { ...foodData, id: id };
  };

    const response = await db.collection("food").doc(userJson().id).set(userJson());

    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

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
    const response = await db
      .collection("userPreferences")
      .doc(id)
      .set(userJson);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const userpredb = db.collection("food");
    const response = await userpredb.get();
    let responseArr = [];
    response.forEach((doc) => {
      responseArr.push(doc.data());
    });
    res.send(responseArr);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userpredb = db.collection("food").doc(req.params.id);
    const response = await userpredb.get(userpredb);
    res.send(response.data());
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userpredb = db
      .collection("food")
      .doc(req.params.id)
      .update({
        food_id: req.body.food_id,
        food_name: req.body.food_name,
        food_type: req.body.food_type || [],
        food_url: req.body.food_url,
        img_url: req.body.img_url,
        favoriteFood: req.body.favoriteFood || [],
      });
    res.send("${idParams}'s data has been Updated");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userpredb = db
      .collection("userPreferences")
      .doc(req.params.id)
      .delete();
    res.send(`${idParams}'s data has been deleted`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;

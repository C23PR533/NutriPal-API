const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore();

router.use(express.urlencoded({ extended: true }));

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

    for (const field in userJson) {
      if (!userJson[field]) {
        res.status(401).json({
          error: true,
          message: `${field} harus diisi`,
        });
      }
    }

    await db.collection("userPreferences").doc(id).set(userJson);
    res.status(200).json({
      error: false,
      message: "Data telah ditambahkan",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const userpredb = db.collection("userPreferences");
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
    const userpredb = db.collection("userPreferences").doc(req.params.id);
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
      .collection("userPreferences")
      .doc(req.params.id)
      .update({
        id_user: req.body.id_user,
        goals: req.body.goals,
        height: req.body.height,
        weight: req.body.weight,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        activityLevel: req.body.activityLevel,
        disease: req.body.disease || [],
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

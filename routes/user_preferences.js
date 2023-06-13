const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const authMiddleware = require("../middleware/authMiddleware");

const db = new Firestore();
router.use(authMiddleware);

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
      disease: Array.isArray(req.body.disease)
        ? req.body.disease
        : [req.body.disease],
      favoriteFood: Array.isArray(req.body.favoriteFood)
        ? req.body.favoriteFood
        : [req.body.favoriteFood],
    };

    for (const field in userJson) {
      if (!userJson[field]) {
        return res.status(400).json({
          code: 400,
          error: true,
          message: `${field} must be filled in`,
        });
      }
    }

    if (userJson.height <= 53 && userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message:
          "The height must be greater than 53 cm and the weight must be greater than 2.7 kg",
      });
    }

    if (userJson.height <= 53) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "The height must be greater than 53 cm",
      });
    }

    if (userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "The weight must be greater than 2.7 kg",
      });
    }

    await db.collection("userPreferences").doc(id).set(userJson);
    res.status(200).json({
      code: 200,
      error: false,
      message: "data has been added",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
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
    res.status(200).json({
      code: 200,
      error: false,
      message: "data has been successfully obtained",
      listUserPreferences: responseArr,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const idUserPre = req.params.id;
    const userpredb = db.collection("userPreferences").doc(req.params.id);
    const response = await userpredb.get(userpredb);

    if (!response.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `User Preference data with id ${idUserPre} not found`,
      });
    }

    res.status(200).json({
      code: 200,
      error: false,
      message: `User Preference data with id ${idUserPre} successfully obtained`,
      listUserPreferences: response.data(),
    });
    // res.send(response.data());
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userJson = {
      id_user: req.body.id_user,
      goals: req.body.goals,
      height: req.body.height,
      weight: req.body.weight,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      activityLevel: req.body.activityLevel,
      disease: Array.isArray(req.body.disease)
        ? req.body.disease
        : [req.body.disease],
      favoriteFood: Array.isArray(req.body.favoriteFood)
        ? req.body.favoriteFood
        : [req.body.favoriteFood],
    };

    for (const field in userJson) {
      if (!userJson[field]) {
        return res.status(400).json({
          code: 400,
          error: true,
          message: `${field} must be filled in`,
        });
      }
    }

    if (userJson.height <= 53 && userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message:
          "The height must be greater than 53 cm and the weight must be greater than 2.7 kg",
      });
    }

    if (userJson.height <= 53) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "The height must be greater than 53 cm",
      });
    }

    if (userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "The weight must be greater than 2.7 kg",
      });
    }

    await db.collection("userPreferences").doc(idParams).update(userJson);

    res.status(200).json({
      code: 200,
      error: false,
      message: `User Preference data with id ${idParams} has been update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userpredb = db
      .collection("userPreferences")
      .doc(req.params.id)
      .delete();
    res.status(200).json({
      code: 200,
      error: false,
      message: `User Preference data with id ${idParams} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;

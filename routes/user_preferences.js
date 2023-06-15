const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const authMiddleware = require("../middleware/authMiddleware");
const admin = require("firebase-admin");

const db = new Firestore();
// router.use(authMiddleware);

router.use(express.urlencoded({ extended: true }));

router.post("/:user_id", validateFirebaseUid, async (req, res) => {
  try {
    const idParams = req.params.user_id;
    const uid = req.user.uid;

    // Memeriksa apakah UID pengguna sesuai dengan ID pengguna yang diminta
    if (uid !== idParams) {
      return res.status(401).json({
        code: 401,
        error: true,
        message: "Unauthorized access",
      });
    }

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
// lama end

// baru start

router.get("/:user_id", validateFirebaseUid, async (req, res) => {
  try {
    const idUserPre = req.params.user_id;
    const uid = req.user.uid;
    const userpredb = db.collection("userPreferences").doc(req.params.user_id);
    const response = await userpredb.get();

    // Memeriksa apakah UID pengguna sesuai dengan ID pengguna yang diminta
    if (uid !== idUserPre) {
      return res.status(401).json({
        code: 401,
        error: true,
        message: "Unauthorized access",
      });
    }

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
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});

// put baru start
router.put("/:user_id", validateFirebaseUid, async (req, res) => {
  try {
    const idParams = req.params.user_id;
    const uid = req.user.uid;

    // Memeriksa apakah UID pengguna sesuai dengan ID pengguna yang diminta
    if (uid !== idParams) {
      return res.status(401).json({
        code: 401,
        error: true,
        message: "Unauthorized access",
      });
    }

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
      message: `User Preference data with id ${idParams} has been updated`,
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

// put baru end

router.delete("/:user_id", validateFirebaseUid, async (req, res) => {
  try {
    const uid = req.user.uid;
    const idParams = req.params.user_id;

    // Memeriksa apakah UID pengguna sesuai dengan ID pengguna yang diminta
    if (uid !== idParams) {
      return res.status(401).json({
        code: 401,
        error: true,
        message: "Unauthorized access",
      });
    }

    const userpredb = db
      .collection("userPreferences")
      .doc(req.params.user_id)
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

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
          message: `${field} harus diisi`,
        });
      }
    }

    if (userJson.height <= 53 && userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message:
          "Tinggi badan harus lebih dari 53 cm dan Berat badan harus lebih dari 2,7 kg",
      });
    }

    if (userJson.height <= 53) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "Tinggi badan harus lebih dari 53 cm",
      });
    }

    if (userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "Berat badan harus lebih dari 2,7 kg",
      });
    }

    await db.collection("userPreferences").doc(id).set(userJson);
    res.status(200).json({
      code: 200,
      error: false,
      message: "Data telah ditambahkan",
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
      message: "Data berhasil didapatkan",
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
        message: `Data User Preference dengan id ${idUserPre} tidak ditemukan`,
      });
    }

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data User Preference dengan id ${idUserPre} berhasil didapatkan`,
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
          message: `${field} harus diisi`,
        });
      }
    }

    if (userJson.height <= 53 && userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message:
          "Tinggi badan harus lebih dari 53 cm dan Berat badan harus lebih dari 2,7 kg",
      });
    }

    if (userJson.height <= 53) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "Tinggi badan harus lebih dari 53 cm",
      });
    }

    if (userJson.weight <= 2.7) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "Berat badan harus lebih dari 2,7 kg",
      });
    }

    await db.collection("userPreferences").doc(idParams).update(userJson);

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data User Preference dengan id ${idParams} telah diupdate`,
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
      message: `Data User Preference dengan id ${idParams} telah dihapus`,
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

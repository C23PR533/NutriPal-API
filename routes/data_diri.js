const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const fs = require("fs");
const path = require("path");
const db = new Firestore();
router.use(express.urlencoded({ extended: true }));

// get all start
router.get("/", async (req, res) => {
  try {
    const userpredb = db.collection("dataDiri");
    const response = await userpredb.get();
    let responseArr = [];
    response.forEach((doc) => {
      responseArr.push(doc.data());
    });
    res
      .status(200)
      .json({ code: 200, message: "data diri berhasil didapatkan", data: responseArr });
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: error.code, message: error.message });
  }
});
// get all end

// get data by id start
router.get("/:id", async (req, res) => {
  try {
    const id = req.body.id_user;
    const idParams = req.params.id;
    const userpredb = db.collection("dataDiri").doc(req.params.id);
    const response = await userpredb.get(userpredb);
    if (!id) {
      throw { code: 403, message: "Unautenticated" };
    }
    if (id !== idParams) {
      throw { code: 403, message: "Unautenticated" };
    }
    if (!response.exists) {
      throw { code: 200, message: "data tidak ditemukan" };
    }
    const data = response.data;
    res
      .status(200)
      .json({ code: 200, message: "data di temukan", data: response.data() });
    // res.send(response.data());
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: error.code, message: error.message });
  }
});
// get data by id end

// add data start
router.post("/", async (req, res) => {
  try {
    const id = req.body.id_user;
    const { id_user, nama, nomor_hp, email, foto_profile, gender, birthdate } =
      req.body;
    if (!id_user) {
      throw { code: 403, message: "Unautenticated" };
    }
    if (!nama) {
      throw { code: 400, message: "nama tidak boleh kosong" };
    }

    const newDataDiri = {
      id_user,
      nama,
      nomor_hp,
      email,
      foto_profile,
      gender,
      birthdate,
    };
    const response = await db.collection("dataDiri").doc(id).set(newDataDiri);
    res.status(200).json({ code: 200, message: "Data berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ code: error.code, message: error.message });
  }
});
// add data end

// update data start
router.put("/:id", async (req, res) => {
  try {
    const id = req.body.id_user;
    const idParams = req.params.id;
    const { nama, nomor_hp, email, foto_profile, gender, birthdate } = req.body;
    if (!id) {
      throw { code: 403, message: "Unautenticated" };
    }
    if (id !== idParams) {
      throw { code: 403, message: "Unautenticated" };
    }
    const newDataDiri = {
      nama,
      nomor_hp,
      email,
      foto_profile,
      gender,
      birthdate,
    };
    const userpredb = db
      .collection("dataDiri")
      .doc(req.params.id)
      .update(newDataDiri, { ignoreUndefinedProperties: true });
    res.status(200).json({ code: 200, message: "data berhasil di update" });
  } catch (error) {
    res.status(400).json({ code: error.code, error: error.message });
  }
});
// update data end

// delete data start
router.delete("/:id", async (req, res) => {
  try {
    const id = req.body.id_user;
    const idParams = req.params.id;

    if (!id) {
      throw { code: 403, message: "Unautenticated" };
    }

    if (!idParams) {
      throw { code: 400, message: "id tidak boleh kosong" };
    }

    if (id !== idParams) {
      throw { code: 403, message: "Unautenticated" };
    }
    const userpredb = db.collection("dataDiri").doc(req.params.id);
    const user = await userpredb.get();
    if (!user.exists) {
      return res.status(404).json({ code: 404, message: "id tidak ditemukan" });
    }
    await userpredb.delete();
    res.status(200).json({ code: 200, message: "data berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ code: error.code, message: error.message });
  }
});
// delete data end

module.exports = router;

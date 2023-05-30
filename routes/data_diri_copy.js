const express = require('express');
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const fs = require('fs');
const path = require('path');
const db = new Firestore();
router.use(express.urlencoded({ extended: true }));


// get all start 
router.get("/", async (req, res) => {
  try {
      const userpredb = db.collection("dataDiri");
      const response = await userpredb.get();
      let responseArr = [];
      response.forEach(doc => {
        responseArr.push(doc.data());
      });
      res.send(responseArr);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
// get all end


// get data by id start
router.get("/:id", async (req, res) => {
  try {
    const userpredb = db.collection("dataDiri").doc(req.params.id);
    const response = await userpredb.get(userpredb);
    res.send(response.data());
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
// get data by id end

// add data start
router.post("/", async (req, res) => {
  try {
    const id = req.body.id_user;
    const { id_user, nama, nomor_hp, email, foto_profile, gender, birthdate } = req.body;

    if (!id_user) {
      throw new Error('id user tidak boleh kosong');
    }
    if (!nama) {
      throw new Error('nama tidak boleh kosong');
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
    res.status(200).json({ code: 200, message: 'Data berhasil ditambahkan'});
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 400, message: error.message });
  }
});
// add data end

// update data start
router.put("/:id", async (req, res) => {
  try {
    const { nama, nomor_hp, email, foto_profile, gender, birthdate } = req.body;
    const userpredb = db
      .collection("dataDiri")
      .doc(req.params.id)
      .update({
        nama,
        nomor_hp,
        email,
        foto_profile,
        gender,
        birthdate
      });
    res.status(200).json({code:200, message:"data berhasil di update"});
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
// update data end

// delete data start
router.delete("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;

    if(!idParams){
      throw new Error("id tidak boleh kosong");
    }
    const userpredb = db
      .collection("dataDiri")
      .doc(req.params.id);
    const user = await userpredb.get();
    if (!user.exists) {
      return res.status(404).json({code:404, message:"id tidak ditemukan"});
    }
    await userpredb.delete();
    res.status(200).json({code:200, message:"data berhasil di hapus"});
  } catch (error) {
    res.status(400).json({code:400, message:error.message});
  }
});
// delete data end

module.exports = router;

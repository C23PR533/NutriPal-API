const express = require('express');
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const fs = require('fs');
const path = require('path');
const db = new Firestore();
router.use(express.urlencoded({ extended: true }));

// ini kode untuk mencari path data_diri.json
// const dataDiriPath = path.join(__dirname, '..', 'data_diri.json');

// ini function untuk load data dari data_diri.json
function loadDataDiri() {
  try {
    const data = fs.readFileSync(dataDiriPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return "error woy";
  }
}

// ini alamat untuk mendapatkan semua data get data all
// router.get('/', (req, res) => {
//   const dataDiri = loadDataDiri();
//   res.json(dataDiri);
// });

// get all baru start 

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

// get baru end


// ini endpoint untuk mendapatkan detail data sesuai dengan id
// router.get('/:id', (req, res) => {
//   const { id } = req.params;
//   const dataDiri = loadDataDiri();
//   const result = dataDiri.find((data) => data.id_user === id);

//   if (result) {
//     res.json(result);
//   } else {
//     res.status(404).json({ message: 'Data diri tidak ditemukan' });
//   }
// });
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

// ini endpoint path untuk menambahkan data 

router.post("/", async (req, res) => {
  try {
    const id = req.body.id_user;
    const { id_user, nama, nomor_hp, email, foto_profile, gender, birthdate } = req.body;
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
    // res.status(201).json({code:200, message: 'data berhasil di tambahkan'});
    // res.send(response);
    res.status(201).json({ code: 200, message: 'Data berhasil ditambahkan'});
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
// post baru start

// router.post("/", async (req, res) => {
//   try {
//     const { id_user, nama, nomor_hp, email, foto_profile, gender, birthdate } = req.body;

//     const newDataDiri = {
//       id_user,
//       nama,
//       nomor_hp,
//       email,
//       foto_profile,
//       gender,
//       birthdate,
//     };

//     const dataDiri = loadDataDiri();
//     dataDiri.push(newDataDiri);
//     saveDataDiri(dataDiri);

//     res.status(201).json(newDataDiri);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error saving user data.");
//   }
// });

// end post baru

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let dataDiri = loadDataDiri();
  const index = dataDiri.findIndex((data) => data.id_user === id);

  if (index !== -1) {
    const deletedData = dataDiri.splice(index, 1)[0];
    saveDataDiri(dataDiri);
    res.json(deletedData);
  } else {
    res.status(404).json({ message: 'Data diri tidak ditemukan' });
  }
});

// ini endpoint path untuk update data 
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { nama, nomor_hp, email, foto_profile, gender, birthdate } = req.body;

  const updatedDataDiri = {
    id_user: id,
    nama,
    nomor_hp,
    email,
    foto_profile,
    gender,
    birthdate,
  };

  let dataDiri = loadDataDiri();
  const index = dataDiri.findIndex((data) => data.id_user === id);

  if (index !== -1) {
    dataDiri[index] = updatedDataDiri;
    saveDataDiri(dataDiri);
    res.json(updatedDataDiri);
  } else {
    res.status(404).json({ message: 'Data diri tidak ditemukan' });
  }
});

// ini function untuk save data diri 
function saveDataDiri(dataDiri) {
  const data = JSON.stringify(dataDiri, null, 2);
  fs.writeFileSync(dataDiriPath, data, 'utf8');
}

module.exports = router;

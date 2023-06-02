const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

const historyPath = path.join(__dirname, "data", "history_aktifitas.json");

// function loadHistory() {
//   try {
//     const data = fs.readFileSync(historyPath, 'utf8');
//     return JSON.parse(data);
//   } catch (err) {
//     return "error woy";
//   }
// }

router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  // const history = loadHistory();
  // res.json(history);
  try {
    const histoactdb = db.collection("historyActivity");
    const response = await histoactdb.get();
    let responseArr = [];
    response.forEach((doc) => {
      responseArr.push(doc.data());
    });
    res.status(200).json({
      code: 200,
      error: false,
      message: "Data berhasil didapatkan",
      listHistoryActivity: responseArr,
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
    const idHistoAct = req.params.id;
    const histoactdb = db.collection("historyActivity").doc(req.params.id);
    const response = await histoactdb.get(histoactdb);

    if (!response.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `Data History Activity dengan id ${idHistoAct} tidak ditemukan`,
      });
    }

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idHistoAct} berhasil didapatkan`,
      listHistoryActivity: response.data(),
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

router.post("/", async (req, res) => {
  const idHistoAct = req.body.id_user;
  try {
    const {
      id_user,
      kalori_harian,
      id_makanan,
      nama_makanan,
      kalori,
      tanggal,
      nama_exercise,
      duration,
      kalori_terbakar,
      sisa_kalori,
    } = req.body;

    const newMakanan = {
      id_makanan: id_makanan,
      nama_makanan: nama_makanan,
      kalori: kalori,
    };

    const newExercise = {
      nama_exercise: nama_exercise,
      duration: duration,
      kalori_terbakar: kalori_terbakar,
    };

    const newAktivitas = {
      id_user: id_user,
      kalori_harian: kalori_harian,
      kalori_masuk: [],
      tanggal: tanggal,
      kalori_keluar: [],
      "Sisa Kalori": sisa_kalori,
    };

    if (Array.isArray(id_makanan)) {
      const makananCount = id_makanan.length;
      for (let i = 0; i < makananCount; i++) {
        const newMakananItem = {
          id_makanan: id_makanan[i],
          nama_makanan: nama_makanan[i],
          kalori: kalori[i],
        };
        newAktivitas.kalori_masuk.push(newMakananItem);
      }
    } else {
      newAktivitas.kalori_masuk.push(newMakanan);
    }
    
    if (Array.isArray(nama_exercise)) {
      const exerciseCount = nama_exercise.length;
      for (let i = 0; i < exerciseCount; i++) {
        const newExerciseItem = {
          nama_exercise: nama_exercise[i],
          duration: duration[i],
          kalori_terbakar: kalori_terbakar[i],
        };
        newAktivitas.kalori_keluar.push(newExerciseItem);
      }
    } else {
      newAktivitas.kalori_keluar.push(newExercise);
    }
    
    const requiredFields = [
      "id_user",
      "kalori_harian",
      "id_makanan",
      "nama_makanan",
      "kalori",
      "tanggal",
      "nama_exercise",
      "duration",
      "kalori_terbakar",
      "sisa_kalori",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        const errorMessage = `${field} harus diisi`;
        return res.status(401).json({
          error: true,
          message: errorMessage,
        });
      }
    }

    const snapshot = await db.collection("historyActivity").doc(id_user).get();

    if (snapshot.exists) {
      const historyData = snapshot.data();
      if (historyData[id_user]) {
        if (historyData[id_user][tanggal]) {
          const existingAktivitas = historyData[id_user][tanggal][0];
          existingAktivitas.kalori_masuk.push(newMakanan);
          await db.collection("historyActivity").doc(id_user).set(historyData);
        } else {
          historyData[id_user][tanggal] = [newAktivitas];
          await db.collection("historyActivity").doc(id_user).set(historyData);
        }
      } else {
        const newData = {
          [id_user]: { [tanggal]: [newAktivitas] },
        };
        await db.collection("historyActivity").doc(id_user).set(newData);
      }
    } else {
      const newData = {
        [id_user]: { [tanggal]: [newAktivitas] },
      };
      await db.collection("historyActivity").doc(id_user).set(newData);
    }
    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idHistoAct} berhasil ditambahkan`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});


router.put("/:id_user", async (req, res) => {
  try {
    const idHistoAct = req.body.id_user;
    const {
      kalori_harian,
      id_makanan,
      nama_makanan,
      kalori,
      tanggal,
      nama_exercise,
      duration,
      kalori_terbakar,
      sisa_kalori,
    } = req.body;

    const updatedAktivitas = {
      kalori_harian: kalori_harian,
      kalori_masuk: [],
      tanggal: tanggal,
      kalori_keluar: [],
      "Sisa Kalori": sisa_kalori,
    };

    if (Array.isArray(id_makanan)) {
      const makananCount = id_makanan.length;
      for (let i = 0; i < makananCount; i++) {
        const newMakanan = {
          id_makanan: id_makanan[i],
          nama_makanan: nama_makanan[i],
          kalori: kalori[i],
        };
        updatedAktivitas.kalori_masuk.push(newMakanan);
      }
    } else {
      const newMakanan = {
        id_makanan: id_makanan,
        nama_makanan: nama_makanan,
        kalori: kalori,
      };
      updatedAktivitas.kalori_masuk.push(newMakanan);
    }

    // logika exercise

    if (Array.isArray(nama_exercise)) {
      const exerciseCount = nama_exercise.length;
      for (let i = 0; i < exerciseCount; i++) {
        const newExercise = {
          nama_exercise: nama_exercise[i],
          duration: duration[i],
          kalori_terbakar: kalori_terbakar[i],
        };
        updatedAktivitas.kalori_keluar.push(newExercise);
      }
    } else {
      const newExercise = {
        nama_exercise: nama_exercise,
        duration: duration,
        kalori_terbakar: kalori_terbakar,
      };
      updatedAktivitas.kalori_keluar.push(newExercise);
    }

    const requiredFields = [
      "id_user",
      "kalori_harian",
      "id_makanan",
      "nama_makanan",
      "kalori",
      "tanggal",
      "nama_exercise",
      "duration",
      "kalori_terbakar",
      "sisa_kalori",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        const errorMessage = `${field} harus diisi`;
        return res.status(401).json({
          error: true,
          message: errorMessage,
        });
      }
    }

    await db
      .collection("historyActivity")
      .doc(id_user)
      .update(updatedAktivitas);
    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idHistoAct} berhasil diperbarui`,
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
    const idHistoAct = req.params.id;
    const histoactdb = db
      .collection("historyActivity")
      .doc(idHistoAct)
      .delete();
    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idHistoAct} telah dihapus`,
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

// function saveHistory(dataHistory) {
//   const data = JSON.stringify(dataHistory, null, 2);
//   fs.writeFileSync(historyPath, data, 'utf8');
// }

module.exports = router;

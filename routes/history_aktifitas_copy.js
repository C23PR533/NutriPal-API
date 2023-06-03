const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

const historyPath = path.join(__dirname, "data", "history_aktifitas.json");

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
    const idCari = req.params.id;
    const response = await db.collection("historyActivity").doc(req.params.id).get();
    const histoactdb = db.collection("historyActivity").doc(req.params.id);
    const data = response.data();
    const cek = await histoactdb.get(histoactdb);
    const historyActivity = {
      id_user: req.params.id,
      History: [],
    };
    if (!cek.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `Data History Activity dengan id ${idCari} tidak ditemukan`,
      });
    }

    const historyArr = Object.values(data[req.params.id]);
      historyArr.forEach((history) => {
        const historyItem = {
          tanggal: history[0].tanggal,
          kalori_harian: history[0].kalori_harian,
          total_kalori: history[0].total_kalori,
          "Sisa Kalori": history[0]["Sisa Kalori"],
          aktifitas: {
            kalori_keluar: history[0].aktifitas.kalori_keluar,
            kalori_masuk: history[0].aktifitas.kalori_masuk,
          },
        };
        historyActivity.History.push(historyItem);
      });
    // const histoactdb = db.collection("historyActivity").doc(req.params.id).get();
    // const response = await histoactdb.get(histoactdb);

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idCari} di temukan`,
      listHistoryActivity: historyActivity,
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
      tanggal: tanggal,
      kalori_harian: kalori_harian,
      total_kalori: parseInt(kalori_harian) + parseInt(kalori_terbakar) - parseInt(kalori),
      "Sisa Kalori": sisa_kalori,
      aktifitas: {
        kalori_keluar: [newExercise],
        kalori_masuk: [newMakanan],
      },
    };

    const requiredFields = [
      "id_user",
      "kalori_harian",
      "id_makanan",
      "nama_makanan",
      "kalori",
      "tanggal",
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
          existingAktivitas.aktifitas.kalori_masuk.push(newMakanan);
          existingAktivitas.aktifitas.kalori_keluar.push(newExercise);
          existingAktivitas.kalori_harian = kalori_harian;
          existingAktivitas.total_kalori =
            parseInt(kalori_harian) + parseInt(kalori_terbakar) - parseInt(kalori);
          existingAktivitas["Sisa Kalori"] = sisa_kalori;
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

    const response = await db.collection("historyActivity").doc(id_user).get();
    const data = response.data();
    const historyActivity = {
      id_user: id_user,
      History: [],
    };
    const historyArr = Object.values(data[id_user]);
    historyArr.forEach((history) => {
      const historyItem = {
        tanggal: history[0].tanggal,
        kalori_harian: history[0].kalori_harian,
        total_kalori: history[0].total_kalori,
        "Sisa Kalori": history[0]["Sisa Kalori"],
        aktifitas: {
          kalori_keluar: history[0].aktifitas.kalori_keluar,
          kalori_masuk: history[0].aktifitas.kalori_masuk,
        },
      };
      historyActivity.History.push(historyItem);
    });

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idHistoAct} berhasil ditambahkan`,
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
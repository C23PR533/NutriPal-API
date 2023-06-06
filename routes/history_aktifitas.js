const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();


router.use(express.urlencoded({ extended: true }));


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
        "sisa_kalori": history[0]["sisa_kalori"],
        aktifitas: {
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

// get data by id

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
        "sisa_kalori": history[0]["sisa_kalori"],
        aktifitas: {
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

// get data by id and tanggal 
router.get("/:id/:tanggal", async (req, res) => {
  try {
    const idCari = req.params.id;
    const tanggalCari = req.params.tanggal;

    const response = await db
      .collection("historyActivity")
      .doc(req.params.id)
      .get();

    const data = response.data();

    if (!data) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `Data History Activity dengan id ${idCari} tidak ditemukan`,
      });
    }

    const historyArr = Object.values(data[req.params.id]);
    const foundHistory = historyArr.find(
      (history) => history[0].tanggal === tanggalCari
    );

    if (!foundHistory) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: `Data History Activity dengan id ${idCari} dan tanggal ${tanggalCari} tidak ditemukan`,
      });
    }

    const historyActivity = {
      id_user: idCari,
      History: [
        {
          tanggal: foundHistory["0"].tanggal,
          kalori_harian: foundHistory.kalori_harian,
          total_kalori: foundHistory.total_kalori,
          sisa_kalori: foundHistory["0"]["sisa_kalori"],
          aktifitas: {
            kalori_masuk: foundHistory["0"].aktifitas.kalori_masuk,
          },
        },
      ],
    };

    for (let i = 0; i < 9; i++) {
      const makanan = foundHistory[i];

      if (makanan) {
        const makananObj = {
          id_makanan: makanan.id_makanan,
          nama_makanan: makanan.nama_makanan,
          waktu: makanan.waktu,
          kalori: makanan.kalori,
        };
      }
    }

    res.status(200).json({
      code: 200,
      error: false,
      message: `Data History Activity dengan id ${idCari} dan tanggal ${tanggalCari} ditemukan`,
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
      waktu,
      sisa_kalori,
    } = req.body;

    const newMakanan = {
      id_makanan: id_makanan,
      nama_makanan: nama_makanan,
      kalori: kalori,
      waktu: waktu,
    };

    const newAktivitas = {
      tanggal: tanggal,
      kalori_harian: kalori_harian,
      total_kalori: parseInt(kalori),
      "sisa_kalori": parseInt(kalori_harian) - parseInt(kalori),
      aktifitas: {
        kalori_masuk: [newMakanan],
      },
    };

    const requiredFields = [
      "id_user",
      "kalori_harian",
      "id_makanan",
      "nama_makanan",
      "kalori",
      "waktu",
      "tanggal",
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
          existingAktivitas.kalori_harian = kalori_harian;
          existingAktivitas.total_kalori += parseInt(kalori);
          existingAktivitas["sisa_kalori"] = parseInt(kalori_harian) - existingAktivitas.total_kalori;
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
        "sisa_kalori": history[0]["sisa_kalori"],
        aktifitas: {
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
      "sisa_kalori": sisa_kalori,
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

module.exports = router;
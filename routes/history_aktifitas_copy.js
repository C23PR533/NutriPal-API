const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const historyPath = path.join(__dirname, 'data', 'history_aktifitas.json');
// const filePath = path.join(__dirname, 'data', 'history_aktifitas.json');

function loadHistory() {
  try {
    const data = fs.readFileSync(historyPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return "error woy";
  }
}
// console.log(filePath);

// Middleware untuk memparsing URL-encoded data
router.use(express.urlencoded({ extended: true }));

// READ
router.get('/', (req, res) => {
  const history = loadHistory();
  res.json(history);
});


// ini endpoint path untuk menambahkan data 
router.post('/', (req, res) => {
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
    sisa_kalori
} = req.body;

const newMakanan = {
  id_makanan: id_makanan,
  nama_makanan: nama_makanan,
  kalori: kalori
};


const newAktivitas = {
  id_user: id_user,
  kalori_harian: kalori_harian,
  kalori_masuk: [],
  tanggal: tanggal,
  kalori_keluar: [
    {
      nama_exercise: nama_exercise,
      duration: duration,
      kalori_terbakar: kalori_terbakar
    }
  ],
  "Sisa Kalori": sisa_kalori
};

// Mengubah format kalori_masuk
const makananCount = id_makanan.length;
for (let i = 0; i < makananCount; i++) {
  const newMakanan = {
    id_makanan: id_makanan[i],
    nama_makanan: nama_makanan[i],
    kalori: kalori[i]
  };
  newAktivitas.kalori_masuk.push(newMakanan);
}


  const dataHistory = loadHistory();
  dataHistory.push(newAktivitas);
  saveHistory(dataHistory);
  res.status(201).json({ message: 'data berhasil di tambahkan' });
});

function saveHistory(dataHistory) {
  const data = JSON.stringify(dataHistory, null, 2);
  fs.writeFileSync(historyPath, data, 'utf8');
}

module.exports = router;

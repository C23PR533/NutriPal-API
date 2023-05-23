const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDiriPath = path.join(__dirname, '..', '..', 'data_diri.json');

// Mendapatkan semua data diri
router.get('/', (req, res) => {
  const dataDiri = loadDataDiri();
  res.json(dataDiri);
});

function loadDataDiri() {
  try {
    const data = fs.readFileSync(dataDiriPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

module.exports = router;

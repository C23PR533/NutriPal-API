const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
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
      .json({ code: 200, message: "data has been successfully obtained", data: responseArr });
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
    const data = response.data;
    res
      .status(200)
      .json({ code: 200, message: "data has been found", data: response.data() });
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
    res.status(200).json({ code: 200, message: "data has been successfully added" });
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
    res.status(200).json({ code: 200, message: "data has been successfully updated" });
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

    const userpredb = db.collection("dataDiri").doc(req.params.id);
    const user = await userpredb.get();
    if (!user.exists) {
      return res.status(404).json({ code: 404, message: "id not found" });
    }
    await userpredb.delete();
    res.status(200).json({ code: 200, message: "data has been successfully deleted" });
  } catch (error) {
    res.status(400).json({ code: error.code, message: error.message });
  }
});
// delete data end


// post data diri photo start
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage({
  projectId: 'nutripal-e746c',
  keyFilename: './kredensial.json',
});

router.post('/photoprofile/:id', upload.single('photo'), async (req, res) => {
  try {
    const bucketName = 'nutripall';
    const file = req.file;
    const id = req.params.id;
    const originalFileName = file.originalname;
    const originalFileExtension = originalFileName.split('.').pop();
    const fileName = `${id}.${originalFileExtension}`;
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    // Hapus file yang sudah ada jika id sama
    await blob.delete().catch(() => {});

    const stream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false, // Tidak mendukung resume jika diinterupsi
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).set('Content-Type', 'application/json').json({code:500, message: 'Failed to save the file' });
    });

    stream.on('finish', () => {
      const publicUrl = `https://storage.cloud.google.com/${bucketName}/${fileName}`;
      res.json({code:200, message: 'File has been successfully saved', url: publicUrl });
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).set('Content-Type', 'application/json').json({code:500, message: 'An error occurred while saving the file' });
  }
});

// post data diri photo end

module.exports = router;

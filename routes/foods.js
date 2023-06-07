const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { Firestore } = require("@google-cloud/firestore");
const fs = require("fs");
const db = new Firestore();

const path = require("path");
const directoryPath = path.join(__dirname, "data", "foods.json");

function convertToCamelCase(str) {
  return str.replace(/\w\S*/g, function (kata) {
    const kataBaru = kata.slice(0, 1).toUpperCase() + kata.substr(1);
    return kataBaru;
  });
}

router.post("/fromjson", async (req, res) => {
  try {
    fs.readdir(directoryPath, async function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(directoryPath, file);
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(data);

        for (let j = 0; j < jsonData.length; j++) {
          const foodData = jsonData[j];
          const id = foodData.food_id;

          const response = await db.collection("food").doc(id).set(foodData);

          console.log("Document written:", response);
        }
      }

      res.send("Data berhasil diunggah ke Firestore");
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const userpredb = db.collection("foods");
    const response = await userpredb.get();
    let responseArr = [];
    response.forEach((doc) => {
      responseArr.push(doc.data());
    });
    res.send(responseArr);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userpredb = db.collection("foods").doc(req.params.id);
    const response = await userpredb.get(userpredb);

    if (!response.exists) {
      return res.status(404).json({
        error: true,
        message: `Data User Preference dengan id ${idParams} tidak ditemukan`,
      });
    }
    res.status(200).json({
      error: false,
      message: `Data Makanan dengan id ${idParams} berhasil didapatkan`,
      listUserPreferences: response.data(),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

// router.get("/search/:foodName", async (req, res) => {
//   const param = convertToCamelCase(req.params.foodName);
//   param.toLowerCase();
//   const foodsRef = db.collection("foods");
//   const query = foodsRef
//     .where("food_name", ">=", param)
//     .where("food_name", "<=", param + "\uf8ff");
//   query
//     .get()
//     .then((snapshot) => {
//       if (snapshot.empty) {
//         res.status(404).json({
//           error: true,
//           message: `Data Makanan dengan nama ${param} tidak ditemukan`,
//         });
//         return;
//       }
//       const makanan = [];
//       snapshot.forEach((doc) => {
//         const id = doc.id;
//         const data = doc.data();
//         makanan.push({ id, ...data });
//       });
//       res.status(200).json({
//         code: 200,
//         message: "Data berhasil didapatkan",
//         data: makanan,
//       });
//     })
//     .catch((error) => {
//       console.log("Error getting documents:", error);
//     });
// });

router.get("/search/:foodName", async (req, res) => {
  const param = convertToCamelCase(req.params.foodName);
  param.toLowerCase();
  const foodsRef = db.collection("foods");
  const query = foodsRef
    .where("food_name", ">=", param)
    .where("food_name", "<=", param + "\uf8ff");
  query
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(404).json({
          error: true,
          message: `Data Makanan dengan nama ${param} tidak ditemukan`,
        });
        return;
      }
      const makanan = [];
      snapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        makanan.push({ id, ...data });
      });
      res.status(200).json({
        code: 200,
        message: "Data berhasil didapatkan",
        data: makanan,
      });
    })
    .catch((error) => {
      console.log("Error getting documents:", error);
    });
});

router.get("/get-json-data/search", async (req, res) => {
  try {
    const response = await fetch(
      "https://c23pr533.github.io/dataFood/foods.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    res.status(500).json({ error: "Failed to fetch JSON data" });
  }
});

router.get("/get-json-data/search/:foodName", async (req, res) => {
  try {
    const response = await fetch(
      "https://c23pr533.github.io/dataFood/foods.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }
    const data = await response.json();

    const { foodName } = req.params;
    const filteredData = data.filter((item) => {
      const foodData = item.food_name.toLowerCase();
      return foodData.includes(foodName.toLowerCase());
    });

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    res.status(500).json({ error: "Failed to fetch JSON data" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const response = await db.collection("food").doc(id).update(updatedData);

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userpredb = db.collection("food").doc(req.params.id).delete();
    res.send(`${idParams}'s data has been deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;

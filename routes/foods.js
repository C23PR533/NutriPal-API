const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const fs = require("fs");
const db = new Firestore();

const path = require("path");
const directoryPath = path.join(__dirname, "data", "foods.json");

router.post("/fromjson", async (req, res) => {
  try {
  const userJson = () => {
    const data = fs.readFileSync(directoryPath, "utf8");
    const jsonData = JSON.parse(data);
    const foodData = jsonData[3];
    const id = foodData.food_id;
    return { ...foodData, id: id };
  };

    const response = await db.collection("food").doc(userJson().id).set(userJson());

    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const userpredb = db.collection("food");
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
    const userpredb = db.collection("food").doc(req.params.id);
    const response = await userpredb.get(userpredb);
    res.send(response.data());
  } catch (error) {
    console.log(error);
    res.send(error);
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
    res.send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const userpredb = db
      .collection("food")
      .doc(req.params.id)
      .delete();
    res.send(`${idParams}'s data has been deleted`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;

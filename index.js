const express = require("express");
const bodyParser = require("body-parser");

const dataDiriRoutes = require("./routes/data_diri");
const userPreference = require("./routes/user_preferences");

const app = express();
const PORT = process.env.PORT || 8080;

const { initializeApp } = require("firebase-admin/app");

const { Firestore } = require("@google-cloud/firestore");
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use("/datadiri", dataDiriRoutes);
app.use("/userpreferences", userPreference);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

app.post("/create", async (req, res) => {
  try {
    const id = req.body.id_user;
    const userJson = {
      id_user: req.body.id_user,
      goals: req.body.goals,
      height: req.body.height,
      weight: req.body.weight,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      activityLevel: req.body.activityLevel,
      disease: req.body.disease || [],
      favoriteFood: req.body.favoriteFood || [],
    };
    const response = db.collection("userPreferences").doc(id).set(userJson);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server berjalan di ${PORT}`)
);

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const dataDiriRoutes = require("./routes/data_diri");
const userPreference = require("./routes/user_preferences");
const foodRoutes = require("./routes/foods_copy");

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;

const { initializeApp } = require("firebase-admin/app");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { Firestore } = require("@google-cloud/firestore");
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use("/datadiri", dataDiriRoutes);
app.use("/userpreferences", userPreference);
app.use("/foods", foodRoutes);

app.listen(PORT, () => console.log(`Server berjalan di ${PORT}`));

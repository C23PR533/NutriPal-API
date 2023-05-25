const express = require("express");
const bodyParser = require("body-parser");

const dataDiriRoutes = require("./routes/data_diri");
const userPreference = require("./routes/user_preferences");
const history_aktifitas = require("./routes/history_aktifitas");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use("/datadiri", dataDiriRoutes);
app.use("/userpreferences", userPreference);
app.use("/history_aktifitas", history_aktifitas);

app.listen(PORT, () =>
  console.log(`Server berjalan di ${PORT}`)
);

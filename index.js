const express = require("express");
const bodyParser = require("body-parser");

const dataDiriRoutes = require("./routes/data_diri");
const userPreference = require("./routes/user_preferences");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.get("/datadiri", dataDiriRoutes);
app.get("/userpreferences", userPreference);

app.listen(PORT, () =>
  console.log(`Server berjalan di ${PORT}`)
);

const fs = require("fs");

const { Firestore } = require("@google-cloud/firestore");
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const path = require("path");
const directoryPath = path.join(__dirname, "./data", "data_makanan (satu serving).json");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    var lastDotIndex = file.lastIndexOf(".");

    var menu = require("./data/" + file);

    menu.forEach(function (obj) {
      db.collection(file.substring(0, lastDotIndex))
        .doc(obj.itemID)
        .set(obj)
        .then(function (docRef) {
          console.log("Document written");
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  });
});
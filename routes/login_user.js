const express = require("express");
const router = express.Router();
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const firebase = require("firebase/app");

router.use(express.urlencoded({ extended: true }));
const firebaseConfig = {
  apiKey: "AIzaSyC3NAPQPtpsFD7xHmxck-DRVc1iZ8wytxs",
};

const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      code: 400,
      error: true,
      message: "Email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      code: 400,
      error: true,
      message: "Password is required",
    });
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;

      const uid = user.uid;

      user.getIdToken().then((idToken) => {
        res.status(200).json({
          code: 200,
          error: false,
          message: "id Token and uid have been successfully obtained",
          data:
          {
            uid: uid,
            idToken: idToken
          }
        });
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      let errorMessage = "";
      let statusCode = 400;
      if (errorCode === "auth/wrong-password") {
        errorMessage = "Wrong password";
      } else if (errorCode === "auth/user-not-found") {
        errorMessage = "Email not found";
      }
      res.status(statusCode).json({
        code: statusCode,
        error: true,
        message: errorMessage,
      });
    });
});

module.exports = router;

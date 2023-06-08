const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const querystring = require("querystring");
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC3NAPQPtpsFD7xHmxck-DRVc1iZ8wytxs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify(
          ({ email, password, returnSecureToken } = req.body)
        ),
      }
    );

    if (!email) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "Email harus diisi",
      });
    }

    if (!password) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "Password harus diisi",
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      // throw new Error(errorData.error.message);
      if (errorData.error.message === "EMAIL_NOT_FOUND") {
        return res.status(400).json({
          code: 400,
          error: true,
          message: "Email tidak ditemukan",
        });
      }
      if (errorData.error.message === "INVALID_PASSWORD") {
        return res.status(400).json({
          code: 400,
          error: true,
          message: "Password Salah",
        });
      }
    }

    const data = await response.json();
    const idToken = data.idToken;

    return res.status(200).json({
      code: 200,
      error: false,
      message: "Id Token berhasil didapatkan",
      idToken,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;

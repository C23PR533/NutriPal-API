const admin = require("firebase-admin");
const functions = require("firebase-functions");

// lama start
module.exports = validateFirebaseUid = async (req, res, next) => {
  console.log("Checking if request is authorized with Firebase UID");

  const uid = req.params.user_id; // Mendapatkan UID dari parameter
  console.log(uid);

  if (!uid) {
    return res.status(401).json({
      code:401,
      error: true,
      message: "Unauthorized access",
    });
  }

  try {
    // Memverifikasi UID dengan menggunakan Firebase Admin SDK
    const userRecord = await admin.auth().getUser(uid);

    // Menyimpan informasi pengguna dalam properti req.user
    req.user = userRecord;

    next();
    return;
  } catch (error) {
    return res.status(401).json({
      code: 401,
      error: true,
      message: "Unauthorized access",
});
  }
};
// lama ends


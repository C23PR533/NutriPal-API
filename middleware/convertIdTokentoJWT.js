const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

// Inisialisasi admin SDK Firebase
admin.initializeApp();

// Fungsi untuk mengonversi Firebase ID Token menjadi JWT
const convertFirebaseIdTokenToJWT = async (firebaseIdToken) => {
  try {
    // Verifikasi Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);

    // Membuat JWT dengan menggunakan payload dari Firebase ID Token
    const jwtToken = jwt.sign(decodedToken, "secret_key");

    return jwtToken;
  } catch (error) {
    console.error("Error while converting Firebase ID Token to JWT:", error);
    throw error;
  }
};

// Meminta ID Token dari pengguna melalui command line
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Masukkan Firebase ID Token: ", async (firebaseIdToken) => {
  // Memanggil fungsi untuk mengonversi Firebase ID Token menjadi JWT
  try {
    const jwtToken = await convertFirebaseIdTokenToJWT(firebaseIdToken);
    console.log("JWT Token:", jwtToken);
    // Lakukan permintaan API dengan menggunakan JWT Token
  } catch (error) {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  }

  readline.close();
});

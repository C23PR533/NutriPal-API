const express = require("express");
const router = express.Router();
const { Firestore } = require("@google-cloud/firestore");
const fs = require("fs");
const db = new Firestore();

const path = require("path");

router.use(express.urlencoded({ extended: true }));

router.post("/:id_user", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const { food_id, food_name, calories } = req.body;

    if (!id_user) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user harus diisi",
      });
    }

    if (!food_id) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_id harus diisi",
      });
    }

    if (!food_name) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_name harus diisi",
      });
    }

    if (!calories) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "calories harus diisi",
      });
    }

    const newFavoriteFood = {
      food_id,
      food_name,
      calories,
    };

    const userPrefRef = db.collection("userPreferences").doc(id_user);
    const userPrefDoc = await userPrefRef.get();

    if (!userPrefDoc.exists) {
      await userPrefRef.set({
        favoriteFood: { [food_id]: newFavoriteFood },
      });
    } else {
      const userPrefData = userPrefDoc.data();
      const favoriteFoods = userPrefData.favoriteFood || {};

      if (favoriteFoods[food_id]) {
        return res.status(400).json({
          code: 400,
          error: true,
          message: "Makanan favorit sudah ada",
        });
      }

      favoriteFoods[food_id] = newFavoriteFood;

      await userPrefRef.set({ favoriteFood: favoriteFoods }, { merge: true });
    }

    res.status(201).json({
      code: 201,
      error: false,
      message: "Makanan favorit berhasil ditambahkan",
      data: newFavoriteFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      error: true,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.get("/:id_user", async (req, res) => {
  try {
    const id_user = req.params.id_user;

    if (!id_user) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user harus diisi",
      });
    }

    const foodsFavoriteRef = db.collection("userPreferences").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Data makanan favorit tidak ditemukan",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData.favoriteFood || {};

    const result = {
      id_user: id_user,
      favoriteFoods: favoriteFoods,
    };

    res.status(200).json({
      error: false,
      message: "Data berhasil didapatkan",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.get("/:id_user/:food_id", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const food_id = req.params.food_id;

    if (!id_user || !food_id) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user dan food_id harus diisi",
      });
    }

    const foodsFavoriteRef = db.collection("userPreferences").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Data makanan favorit tidak ditemukan",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData.favoriteFood || {};

    const selectedFood = favoriteFoods[food_id];

    if (!selectedFood) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Makanan favorit tidak ditemukan",
      });
    }

    const result = {
      id_user: id_user,
      favoriteFoods: [
        {
          food_name: selectedFood.food_name,
          calories: selectedFood.calories,
          food_id: food_id,
        },
      ],
    };

    res.status(200).json({
      error: false,
      message: "Data berhasil didapatkan",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Terjadi kesalahan pada server",
    });
  }
});

router.delete("/:id_user/:food_id", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const food_id = req.params.food_id;

    if (!id_user) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user harus diisi",
      });
    }

    if (!food_id) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_id harus diisi",
      });
    }

    const foodsFavoriteRef = db.collection("userPreferences").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Data makanan favorit tidak ditemukan",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData.favoriteFood || {};

    if (!favoriteFoods[food_id]) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Makanan favorit tidak ditemukan",
      });
    }

    delete favoriteFoods[food_id];

    await foodsFavoriteRef.update({ favoriteFood: favoriteFoods });

    res.status(200).json({
      code: 200,
      error: false,
      message: "Makanan favorit berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      error: true,
      message: "Terjadi kesalahan pada server",
    });
  }
});



module.exports = router;

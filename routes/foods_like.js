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

    const foodsLikeRef = db.collection("foodsLike").doc(id_user);
    const foodsLikeDoc = await foodsLikeRef.get();

    if (!foodsLikeDoc.exists) {
      await foodsLikeRef.set({ favoriteFoods: [newFavoriteFood] });
    } else {
      const foodsLikeData = foodsLikeDoc.data();
      const favoriteFoods = foodsLikeData.favoriteFoods || [];

      const isDuplicate = favoriteFoods.some(
        (food) => food.food_id === food_id
      );

      if (isDuplicate) {
        return res.status(400).json({
          code: 400,
          error: true,
          message: "Makanan favorit sudah ada",
        });
      }

      favoriteFoods.push(newFavoriteFood);

      await foodsLikeRef.set({ favoriteFoods }, { merge: true });
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

module.exports = router;

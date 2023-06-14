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
    const { food_name } = req.body;

    if (!id_user) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user is required",
      });
    }

    if (!food_name) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_name is required",
      });
    }

    const userPrefRef = db.collection("userPreferences").doc(id_user);
    const userPrefDoc = await userPrefRef.get();

    if (!userPrefDoc.exists) {
      await userPrefRef.set({
        favoriteFood: [food_name],
      });
    } else {
      const userPrefData = userPrefDoc.data();
      const favoriteFoods = userPrefData.favoriteFood || [];

      const isDuplicate = favoriteFoods.includes(food_name);

      if (isDuplicate) {
        return res.status(400).json({
          code: 400,
          error: true,
          message: "Favorite food already exists",
        });
      }

      favoriteFoods.push(food_name);

      await userPrefRef.update({ favoriteFood: favoriteFoods });
    }

    res.status(201).json({
      code: 201,
      error: false,
      message: "Favorite food added successfully",
      data: { food_name },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      error: true,
      message: "An error occurred on the server",
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
        message: "id_user is required",
      });
    }

    const foodsFavoriteRef = db.collection("userPreferences").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Favorite food data not found",
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
      message: "Data successfully obtained",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "An error occurred on the server",
    });
  }
});

router.get("/:id_user/:food_name", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const food_name = req.params.food_name;

    if (!id_user) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user is required",
      });
    }

    if (!food_name) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_name is required",
      });
    }

    const userPrefRef = db.collection("userPreferences").doc(id_user);
    const userPrefDoc = await userPrefRef.get();

    if (!userPrefDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Favorite food data not found",
      });
    }

    const userPrefData = userPrefDoc.data();
    const favoriteFoods = userPrefData.favoriteFood || [];

    const selectedFood = favoriteFoods.find((food) => food === food_name);

    if (!selectedFood) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Favorite food not found",
      });
    }

    const result = {
      id_user: id_user,
      favoriteFoods: [
        {
          food_name: selectedFood,
        },
      ],
    };

    res.status(200).json({
      error: false,
      message: "Data successfully obtained",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "An error occurred on the server",
    });
  }
});


router.delete("/:id_user/:food_name", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const food_name = req.params.food_name;

    if (!id_user) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user is required",
      });
    }

    if (!food_name) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_name is required",
      });
    }

    const foodsFavoriteRef = db.collection("userPreferences").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Favorite food data not found",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData.favoriteFood || [];

    const foodIndex = favoriteFoods.findIndex((food) => food === food_name);

    if (foodIndex === -1) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Favorite food not found",
      });
    }

    favoriteFoods.splice(foodIndex, 1);

    await foodsFavoriteRef.update({ favoriteFood: favoriteFoods });

    res.status(200).json({
      code: 200,
      error: false,
      message: "Favorite food successfully deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      error: true,
      message: "An error occurred on the server",
    });
  }
});




module.exports = router;

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
        message: "id_user must be filled",
      });
    }

    if (!food_id) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_id must be filled",
      });
    }

    if (!food_name) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_name must be filled",
      });
    }

    if (!calories) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "calories must be filled",
      });
    }

    const newFavoriteFood = {
      food_id,
      food_name,
      calories,
    };

    const foodsFavoriteRef = db.collection("foodsFavorite").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      await foodsFavoriteRef.set({
        [id_user]: { favoriteFoods: [newFavoriteFood] },
      });
    } else {
      const foodsFavoriteData = foodsFavoriteDoc.data();
      const favoriteFoods = foodsFavoriteData[id_user]?.favoriteFoods || [];

      const isDuplicate = favoriteFoods.some(
        (food) => food.food_id === food_id
      );

      if (isDuplicate) {
        return res.status(400).json({
          code: 400,
          error: true,
          message: "Favorite food already exists",
        });
      }

      favoriteFoods.push(newFavoriteFood);

      await foodsFavoriteRef.set({ [id_user]: { favoriteFoods } }, { merge: true });
    }

    res.status(201).json({
      code: 201,
      error: false,
      message: "Favorite food has been successfully added",
      data: newFavoriteFood,
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
        message: "id_user must be filled in",
      });
    }

    const foodsFavoriteRef = db.collection("foodsFavorite").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Favorite food data not found",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData[id_user]?.favoriteFoods || [];

    const result = {
      id_user: id_user,
      favoriteFoods: favoriteFoods,
    };

    res.status(200).json({
      error: false,
      message: "data has been successfully obtained",
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

router.get("/:id_user/:food_id", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const food_id = req.params.food_id;

    if (!id_user || !food_id) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "id_user and food_id must be filled in",
      });
    }

    const foodsFavoriteRef = db.collection("foodsFavorite").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "The favorite food data was not found",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData[id_user]?.favoriteFoods || [];

    const selectedFood = favoriteFoods.find((food) => food.food_id === food_id);

    if (!selectedFood) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "The favorite food was not found",
      });
    }

    const result = {
      id_user: id_user,
      favoriteFoods: [
        {
          food_name: selectedFood.food_name,
          calories: selectedFood.calories,
          food_id: selectedFood.food_id,
        },
      ],
    };

    res.status(200).json({
      error: false,
      message: "The data has been successfully obtained",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "The server encountered an error",
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
        message: "id_user must be filled",
      });
    }

    if (!food_id) {
      return res.status(400).json({
        code: 400,
        error: true,
        message: "food_id must be filled",
      });
    }

    const foodsFavoriteRef = db.collection("foodsFavorite").doc(id_user);
    const foodsFavoriteDoc = await foodsFavoriteRef.get();

    if (!foodsFavoriteDoc.exists) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "The favorite food data was not found",
      });
    }

    const foodsFavoriteData = foodsFavoriteDoc.data();
    const favoriteFoods = foodsFavoriteData[id_user]?.favoriteFoods || [];

    const updatedFavoriteFoods = favoriteFoods.filter(
      (food) => food.food_id !== food_id
    );

    await foodsFavoriteRef.set(
      { [id_user]: { favoriteFoods: updatedFavoriteFoods } },
      { merge: true }
    );

    res.status(200).json({
      code: 200,
      error: false,
      message: "The favorite food has been successfully deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      error: true,
      message: "The server encountered an error",
    });
  }
});


module.exports = router;

const express = require("express");
const { addCar, getAllCars, getCarById, updateCar, deleteCar } = require("../Controllers/carController");
const upload = require("../Middleware/multerConfig");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

// POST route to add a new car
router.post("/add", protect, upload.array("images", 10), addCar); // up to 10 images

// GET route to get all cars of a user
router.get("/user-cars", protect, getAllCars);

// GET route to get a specific car by its ID
router.get("/carDetail/:id", protect, getCarById);

// PUT route to update car details and images
router.put("/carDetail/:id", protect, upload.array("images", 10), updateCar);

// DELETE route to delete a car
router.delete("/carDetail/:id", protect, deleteCar); // Delete car by ID

module.exports = router;

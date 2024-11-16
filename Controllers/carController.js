const Car = require('../Models/carModel');
const User = require('../Models/userModel');  // Assuming you have a User model for user validation

// Create a new car
const addCar = async (req, res) => {
  try {
    // Log the authenticated user
    console.log('Authenticated User:', req.user); 

    const { title, description, tags } = req.body;

    // Ensure at least one image is uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Map the uploaded files to their paths
    const imagePaths = req.files.map((file) => file.path);

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Create a new car document
    const newCar = new Car({
      user: req.user._id, 
      title,
      description,
      images: imagePaths, // Save image paths to MongoDB
      tags: tags.split(',').map((tag) => tag.trim()), // Split tags into an array
    });

    // Save the car to the database
    await newCar.save();

    res.status(201).json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding car' });
  }
};

// Get all cars created by the authenticated user
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id }); // Only return cars associated with the authenticated user
    console.log(cars);
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

// Get a specific car by ID
const getCarById = async (req, res) => {
  try {
    // Get the car by the ID from the URL parameters
    const car = await Car.findById(req.params.id);

    // Check if the car exists
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the car belongs to the authenticated user
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this car' });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching car' });
  }
};

const updateCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Find the car by ID
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the car belongs to the authenticated user
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this car' });
    }

    // Update car fields
    if (title) car.title = title;
    if (description) car.description = description;
    if (tags) car.tags = tags.split(',').map((tag) => tag.trim());

    // Handle image updates (if any images are uploaded)
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path);
      car.images = [...car.images, ...imagePaths]; // Add new images
    }

    // Check if there are any images to delete
    if (req.body.deletedImages) {
      const deletedImages = JSON.parse(req.body.deletedImages); // Expecting a JSON array of image paths
      car.images = car.images.filter((img) => !deletedImages.includes(img));
    }

    // Make sure there are no more than 10 images
    if (car.images.length > 10) {
      return res.status(400).json({ message: 'You can upload a maximum of 10 images.' });
    }

    // Save the updated car
    await car.save();

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating car' });
  }
};

const deleteCar = async (req, res) => {
  try {
    // Find the car by ID
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if the car belongs to the authenticated user
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this car" });
    }

    // Delete the car using deleteOne()
    await Car.deleteOne({ _id: car._id });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting car", error: error.message });
  }
};


module.exports = {
  addCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};

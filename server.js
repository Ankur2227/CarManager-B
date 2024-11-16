const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const carRoutes = require("./Routes/carRoutes");
const path = require('path');  // Add this line to import path

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.get("/", (req,res)=>{
    res.send("API is running.");
});

app.use("/api/user", userRoutes);
app.use("/api/cars", carRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
const PORT = 5000;

app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

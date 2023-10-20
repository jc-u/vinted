require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// Import de cloudinary
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

// Je me connecte à mon compte cloudinary avec les identifiants présents sur mon compte
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
	res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
	console.log("Server started");
});

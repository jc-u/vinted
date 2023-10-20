const mongoose = require("mongoose");

// Rajoutez un clef product_pictures de type Array à votre modèle Offer

const Offer = mongoose.model("Offer", {
	product_name: String,
	product_description: String,
	product_price: Number,
	product_details: Array,
	product_pictures: Array,
	product_image: Object,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = Offer;

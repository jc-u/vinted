const express = require("express");
const { create } = require("../models/User");
const router = express.Router();
const stripe = require("stripe");

const stripe = createStripe(process.env.STRIPE_API_SECRET);

router.post("/payment", async (req, res) => {
	console.log(req.body);
	try {
		// Je récupère le token reçu depuis le front
		const stripeToken = req.body.stripeToken;
		// Je fais une requête à stripe pour créer une transaction
		const responseFromStripe = await stripe.charges.create({
			amount: (req.body.amount * 100).toFixed(0),
			currency: "eur",
			description: `Paiement vinted pour : ${req.body.title}`,
			source: req.body.token,
		});
		// Si le paiement s'est bien passé, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé

		console.log(responseFromStripe);
		res.json({ status: responseFromStripe.status });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;

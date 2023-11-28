const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

router.post("/payment", async (req, res) => {
	try {
		console.log(req.body);
		// Je récupère le token reçu depuis le front
		const stripeToken = req.body.stripeToken;
		// Je fais une requête à stripe pour créer une transaction
		const responseFromStripe = await stripe.charges.create({
			token: stripeToken,
			title: req.body.title,
			amount: req.body.price * 100,
		});
		// Si le paiement s'est bien passé, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé

		console.log(responseFromStripe);
		res.json({ status: responseFromStripe.status });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;

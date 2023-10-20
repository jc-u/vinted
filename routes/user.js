const uid2 = require("uid2"); // Package qui sert à créer des string aléatoires
const SHA256 = require("crypto-js/sha256"); // Sert à encripter une string
const encBase64 = require("crypto-js/enc-base64"); // Sert à transformer l'encryptage en string

const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
	try {
		const { username, email, password, newsletter } = req.body;
		// console.log(username);
		// Revient au même que faire ceci :
		// const username = req.body.username;
		// const email = req.body.email;
		// const password = req.body.password;
		// const newsletter = req.body.newsletter;

		if (!username) {
			//   console.log("ok");
			return res.status(400).json({ message: "Missing parameter" });
		}

		const userAlreadyInDb = await User.findOne({ email: email });
		// console.log(userAlreadyInDb);

		if (userAlreadyInDb) {
			return res.status(409).json({ message: "This email is already used" });
		}

		// console.log(req.body);

		// On génère un salt
		const salt = uid2(16);
		// On génère un hash
		const hash = SHA256(req.body.password + salt).toString(encBase64);
		// On génère un token
		const token = uid2(64);

		const newUser = new User({
			email: req.body.email,
			password: req.body.password,
			account: {
				username: req.body.username,
			},
			newsletter: true,
			salt: salt,
			hash: hash,
			token: token,
		});
		await newUser.save();
		res.status(201).json({
			_id: newUser._id,
			//   account: {
			//     username: newUser.account.username
			//   }
			account: newUser.account,
			token: newUser.token,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/user/login", async (req, res) => {
	try {
		// On va chercher dans la BDD un utilisateur dont l'email est celui reçu
		// Exemple de destructuring
		const { email, password } = req.body;

		const user = await User.findOne({ email: req.body.email });

		if (user === null) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		console.log(user);

		const newHash = SHA256(user.salt + req.body.password).toString(encBase64);

		if (newHash !== user.hash) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		res.json({
			_id: user._id,
			token: user.token,
			account: user.account,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;

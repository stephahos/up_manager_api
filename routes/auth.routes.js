const router = require("express").Router();
const User = require("../models/User.model");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/middleware");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Encrypt pwd
  const salt = genSaltSync(11);
  const hashedPassword = hashSync(password, salt);
  // Record to DB
  await User.create({ firstName, lastName, email, password: hashedPassword });
  res.status(201).json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  if (currentUser) {
    if (compareSync(password, currentUser.password)) {
      const userCopy = { ...currentUser._doc };
      delete userCopy.password;
      // Generate the JWT (don't forget to put a secret in your .env file)
      const authToken = jwt.sign(
        {
          expiresIn: "6h",
          user: userCopy,
        },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
        }
      );

      res.status(200).json({ status: 200, token: authToken });
    } else {
      res.status(400).json({ message: "Wrong password" });
    }
  } else {
    res.status(404).json({ message: "No user with this email" });
  }
});

router.get("/verify", isAuthenticated, async (req, res) => {
  //console.log(`req.payload`, req.payload);
  res.status(200).json({ payload: req.payload, message: "Token OK" });
  const currentUser = await User.findById(req.payload.user._id).populate(
    "createdProjects"
  );
});

module.exports = router;

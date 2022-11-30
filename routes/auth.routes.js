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
  const userEmail = await User.findOne({ email: req.body.email });
  // Record to DB
  if (userEmail === null) {
    await User.create({ firstName, lastName, email, password: hashedPassword });
    const emailUser = await User.findOne({ email });

    if (emailUser.email === "sara@sara.com.br") {
      await User.findOneAndUpdate(emailUser._id, { isManager: true });
    }
    res.status(201).json({ status: 201, message: "User created" });
  } else {
    res
      .status(400)
      .json({ message: "We already have a user with that e-mail." });
  }
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
  const currentUser = await User.findById(req.payload.user._id).populate(
    "createdProjects"
  );
  res
    .status(200)
    .json({ payload: req.payload, message: "Token OK", user: currentUser });
});

router.get("/profile/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userProfile = await User.findById(id);

    res.json({ ...userProfile._doc });
  } catch (error) {
    res.status(404).json({ message: "No profile in here" });
  }
});

router.post("/profile/id", isAuthenticated, async (req, res, next) => {
  const body = req.body;
  const user = await User.create(body);

  const currentUser = await User.findByIdAndUpdate(req.payload.User._id, {
    $push: { createdUser: User._id },
  });

  router.put("/profile/:id", async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
  
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    res.json({ user });
  });

  res.status(201).json({ user});
});


module.exports = router;
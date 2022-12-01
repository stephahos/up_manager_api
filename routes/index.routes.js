const isAuthenticated = require("../middleware/middleware");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const Event = require("../models/Event.model");

const router = require("express").Router();
const uploader = require("../middleware/cloudinary.config.js");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/projects", async (req, res, next) => {
  const projects = await Project.find().populate("createdBy");

  res.json(projects);
});

router.get("/projects/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("createdBy");

    res.json({ ...project._doc });
  } catch (error) {
    res.status(404).json({ message: "No project with this id" });
  }
});

router.post("/projects", isAuthenticated, async (req, res, next) => {
  const body = req.body;

  const currentUser = await User.findById(req.payload.user._id);
  const project = await Project.create({
    ...body,
    createdBy: currentUser,
  });
  await User.findByIdAndUpdate(req.payload.user._id, {
    $push: { createdProjects: project },
  });

  res.status(201).json({ project });
});

router.put("/projects/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const project = await Project.findByIdAndUpdate(id, body, { new: true });

  res.json({ project });
});

router.delete("/projects/:id", async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);

  res.json(project);
});

// Event Routes

router.get("/events", async (req, res, next) => {
  const events = await Event.find().populate(
    "participants"
    /* "createdBy" */
    /*  "projectsReviewed" */
  );

  res.json(events);
});

router.get("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate(
      /* "createdBy", */
      "participants"
      /* "projectsReviewed" */
    );

    res.json({ ...event._doc });
  } catch (error) {
    res.status(404).json({ message: "No event with this id" });
  }
});

router.post("/events", isAuthenticated, async (req, res, next) => {
  const body = req.body;
  const currentUser = await User.findById(req.payload.user._id);
  const event = await Event.create({ ...body, createdBy: currentUser });

  /* const currentUser = await User.findByIdAndUpdate(req.payload.user._id, {
    $push: { createdEvents: event._id },
  }); */

  res.status(201).json({ event });
});

router.put("/events/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const event = await Event.findByIdAndUpdate(id, body, { new: true });

  res.json({ event });
});

router.delete("/events/:id", async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);

  res.json(event);
});

// Users Routes
router.get("/users", async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

router.post(
  "/upload/:id",
  uploader.single("imageUrl"),
  async (req, res, next) => {
    console.log("file is: ", req.file);
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { image: req.file.path },
      { new: true }
    );
    console.log(updatedUser);

    if (!req.file) {
      console.log("there was an error uploading the file");
      next(new Error("No file uploaded!"));
      return;
    }
    res.json(updatedUser);
  }
);

module.exports = router;

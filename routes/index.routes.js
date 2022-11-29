const isAuthenticated = require("../middleware/middleware");
const Project = require("../models/Project.model");
const User = require("../models/User.model");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/projects", async (req, res, next) => {
  const projects = await Project.find();

  res.json(projects);
});

router.get("/projects/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    res.json({ ...project._doc });
  } catch (error) {
    res.status(404).json({ message: "No project with this id" });
  }
});

router.post("/projects", isAuthenticated, async (req, res, next) => {
  const body = req.body;
  console.log("test", req.payload);
  const project = await Project.create(body);

  const currentUser = await User.findByIdAndUpdate(req.payload.user._id, {
    $push: { createdProjects: project._id },
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
  const events = await Event.find();

  res.json(events);
});

router.get("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    res.json({ ...event._doc });
  } catch (error) {
    res.status(404).json({ message: "No event with this id" });
  }
});

router.post("/events", isAuthenticated, async (req, res, next) => {
  const body = req.body;
  console.log("test", req.payload);
  const event = await Event.create(body);

  const currentEvent = await Event.findByIdAndUpdate(req.payload.event._id, {
    $push: { createdEvents: event._id },
  });

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

module.exports = router;

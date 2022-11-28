const isAuthenticated = require("../middleware/middleware");
const Project = require("../models/Project.model");
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

router.post("/projects", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  const project = await Project.create(body);

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

module.exports = router;

import express from "express";
import * as auth from "../controllers/authController";
import * as project from "../controllers/projectController";
const router = express.Router();

// Get All Projects
router.get("/", project.getAllProjects);
// Get Single Project
router.get("/:projectId", auth.protect, project.getSingleProject);
// Create a New Project
router.post("/", auth.protect, project.createNewProject);
// Update Project
router.patch("/:projectId", auth.protect, project.updateProject);
// delete Project
router.delete("/:projectId", auth.protect, project.deleteProject);

export default router;

import express from "express";
import prisma from "../db/prisma";
import * as auth from "./../controllers/authController";
import * as update from "../controllers/updateController";

const router = express.Router();
// Create a new update attach that to a previously created Project
router.post("/:projectId", auth.protect, update.createUpdateToAnProject);

// patch/update the update (only title is the filed to update)
router.patch("/:updateId", auth.protect, update.patchUpdate);

// Delete the Update
router.delete("/:updateId", auth.protect, update.deleteUpdate);

export default router;

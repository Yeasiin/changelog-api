import express from "express";
import { z } from "zod";
import prisma from "../db/prisma";
import * as auth from "./../controllers/authController";

const router = express.Router();

const updateSchema = z.object({
  title: z.string().min(3),
  projectId: z.string(),
});

router.post("/", auth.protect, async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const projectId = data.projectId;
    const title = data.title;
    const userId = (req as any).user.id;

    const project = await prisma.project.findUniqueOrThrow({
      where: {
        project: {
          id: projectId,
          userId: userId,
        },
      },
    });

    const update = await prisma.update.create({
      data: {
        title: title,
        projectId: project.id,
        userId: userId,
      },
    });

    res.json({
      status: "success",
      data: update,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:updateId", auth.protect, async (req, res, next) => {
  try {
    const projectId = req.body.updateId;
    const updateId = req.params.updateId;

    const userId = (req as any).user.id;

    const update = await prisma.update.delete({
      where: {
        update: {
          id: updateId,
          projectId: projectId,
          userId: userId,
        },
      },
    });

    res.json({ status: "confused", update });
  } catch (err) {
    next(err);
  }
});

export default router;

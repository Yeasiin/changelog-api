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

    const project = await prisma.project.findUnique({
      where: {
        project: {
          id: projectId,
          userId: userId,
        },
      },
    });

    if (!project)
      throw new Error(
        "But This is not your Product to add update by your self"
      );

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

router.patch("/:updateId", auth.protect, async (req, res, next) => {
  try {
    const updateId = req.params.updateId;
    const userId = (req as any).user.id;
    const title = req.body.title;

    console.log(updateId, userId, title);

    const data = await prisma.update.update({
      where: {
        update: {
          userId: userId,
          updateId: updateId,
        },
      },
    });

    res.json({ status: "success", data: data });
  } catch (err) {
    next(err);
  }
});

router.delete("/:updateId", auth.protect, async (req, res, next) => {
  try {
    const updateId = req.params.updateId;
    const userId = (req as any).user.id;
    const projectId = req.body.projectId ?? "helo";
    if (!projectId)
      throw new Error("Sending Project Id Thorough body is required");

    const data = await prisma.update.delete({
      where: {
        update,
      },
    });

    res.json({ status: "confused", data });
  } catch (err) {
    next(err);
  }
});

export default router;

import express, { Request } from "express";
import { string, z } from "zod";
import prisma from "../db/prisma";
import * as auth from "../controllers/authController";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await prisma.project.findMany({
      include: {
        update: true,
      },
    });
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

router.get("/:projectId", auth.protect, async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = (req as any).user.id;

    const project = await prisma.project.findUnique({
      where: {
        project: {
          id: projectId,
          userId: userId,
        },
      },
    });

    if (!project) throw new Error("no data found");

    res.json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
});

const projectUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
});

router.patch("/:projectId", auth.protect, async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = (req as any).user.id;

  try {
    const data = projectUpdateSchema.parse(req.body);
    const project = await prisma.project.update({
      where: {
        project: {
          id: projectId,
          userId: userId,
        },
      },
      data: data,
    });

    res.json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
});

const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

router.post("/", auth.protect, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        userId: userId,
      },
    });

    res.json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
});

router.delete("/:projectId", auth.protect, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const projectId = req.params.projectId;

    const data = await prisma.project.delete({
      where: {
        project: {
          id: projectId,
          userId: userId,
        },
      },
    });

    res.json({ status: "success", msg: data });
  } catch (err) {
    next(err);
  }
});

export default router;

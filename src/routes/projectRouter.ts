import express, { Request } from "express";
import { string, z } from "zod";
import prisma from "../db/prisma";
import * as auth from "../controllers/authController";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await prisma.project.findMany({});
    res.json({ status: "success", data });
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
        userId: userId,
        title: data.title,
        description: data.description,
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
        id: projectId,
        userId_id: userId,
      },
    });
    res.json({ status: "success", msg: data });
  } catch (err) {
    next(err);
  }
});

export default router;

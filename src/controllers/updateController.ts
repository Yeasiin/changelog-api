import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

// Create a New Update to a existing Project with
export async function createUpdateToAnProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const title = req.body.title;
    if (!title) throw new Error("Title Field Is Required");

    const projectId = req.params.projectId;
    if (!projectId)
      throw new Error(
        "Project is Required otherwise how we gonna know which project Update is This"
      );

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
}

// Update/Patch the Update
export async function patchUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updateId = req.params.updateId;
    const userId = (req as any).user.id;
    const title = req.body.title;

    const data = await prisma.update.update({
      where: {
        update: { id: updateId, userId: userId },
      },
      data: {
        title: title,
      },
    });

    res.json({ status: "success", data: data });
  } catch (err) {
    next(err);
  }
}

// Delete the Update
export async function deleteUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updateId = req.params.updateId;
    const userId = (req as any).user.id;
    const data = await prisma.update.delete({
      where: {
        update: { id: updateId, userId: userId },
      },
    });
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

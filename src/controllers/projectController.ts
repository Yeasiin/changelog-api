import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "./../db/prisma";

// Get All Projects from the database
export async function getAllProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await prisma.project.findMany({
      include: {
        updates: true,
      },
    });
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
}

// Get Single Project By Project Id (only if this user is the creator of the project  )
export async function getSingleProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      include: {
        updates: true,
      },
    });

    if (!project) throw new Error("no data found");

    res.json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
}

// Create an New Project also get pass the user reference to the database as userId
// Required Field to Create a New Project (enforcing them by using Zod)
const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

export async function createNewProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
}

// Updating the project
// Required Field to Update Previously Created Project ( also user have to the same that's why we took the userId while creating new Project so we can check )
const projectUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
});

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId;
    const userId = (req as any).user.id;
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

    if (!project)
      throw new Error("😑 You are Not Authorize to do this request");

    res.json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
}

// Delete Project (only if the user is same as whoever created the project)
export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
}

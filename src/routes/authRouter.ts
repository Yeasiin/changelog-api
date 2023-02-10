import express from "express";
import { z, ZodError } from "zod";
import prisma from "../db/prisma";
import * as auth from "../controllers/authController";

const signUpSchema = z
  .object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email().min(3),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
    path: ["confirmPassword"],
  });

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const data = signUpSchema.parse(req.body);
    const hashed = await auth.getHashed(data.password);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashed,
      },
    });

    delete user["password"];

    const token = auth.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ status: "success", token, data: user });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      res.json({ status: "failed", data: err.format() });
    }
    res.json({ status: "failed", data: err });
  }
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
userRouter.post("/login", async (req, res, next) => {
  try {
    const data = userLoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) throw new Error("user doesn't exit");
    const isValidUser = await auth.comparePassword(
      data.password,
      user.password
    );

    if (!user || !isValidUser) {
      throw new Error("Email or password is not correct");
    }

    delete user["password"];
    const token = auth.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ status: "success", token, data: user });
  } catch (err) {
    console.log("ami here", err);
    next(err);
    /* if (err instanceof ZodError) {
      res.json({ status: "failed", data: err.format() });
    } */
  }
});

export default userRouter;

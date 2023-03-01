import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import prisma from "../db/prisma";
import * as auth from "./authController";
import { exclude } from "../db/utils";

// Starting Create New User
// Required Field to Create a New User Enforcing With Zod Validation
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

// Create An New User as USER Role
export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    // delete the password filed before sending to the client
    exclude(user, ["password"]);

    const token = auth.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ status: "success", token, data: user });
  } catch (err) {
    if (err instanceof ZodError) {
      res.json({ status: "failed", data: err.format() });
    }
    res.json({ status: "failed", data: err });
  }
}
// End of Create New User

// Start of Login User

// Login User Required Filed On body (enforcing Them using With Zod Validation)
const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Login User
export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    // delete the password filed before sending to the client
    exclude(user, ["password"]);
    const token = auth.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ status: "success", token, data: user });
  } catch (err) {
    next(err);
    /* if (err instanceof ZodError) {
          res.json({ status: "failed", data: err.format() });
        } */
  }
}

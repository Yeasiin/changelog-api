import { Request, Response, NextFunction } from "express";
import * as JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

export function signToken(value: { id: string; email: string; role: string }) {
  return JWT.sign(value, process.env.JWT_SECRET as string);
}

export function getHashed(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function protect(req: Request, _: Response, next: NextFunction) {
  const bearer = req.headers["authorization"];
  if (!bearer) throw new Error("invalid request");
  const [, token] = bearer.split(" ");
  try {
    const user = JWT.verify(token, process.env.JWT_SECRET as string);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

// export function createSendToken(email);

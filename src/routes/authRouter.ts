import express from "express";
import * as user from "./../controllers/userController";

const userRouter = express.Router();

// Create new user
userRouter.post("/signup", user.createAccount);
// login to the account
userRouter.post("/login", user.loginUser);

export default userRouter;

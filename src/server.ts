import express, { Request, Response, NextFunction, Errback } from "express";
import userRouter from "./routes/userRouter";
import projectRouter from "./routes/projectRouter";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err, "form server 💣🔴");
  res.json({
    status: "failed",
    data: err["message"],
  });
});

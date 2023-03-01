import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import userRouter from "./routes/authRouter";
import projectRouter from "./routes/projectRouter";
import updateRouter from "./routes/updateRouter";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/updates", updateRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err, "form server 💣🔴");
  res.json({
    status: "failed",
    data: err.message,
  });
});

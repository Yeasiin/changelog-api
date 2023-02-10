import dotenv from "dotenv";
dotenv.config();
import { app } from "./server";

const PORT = process.env.PORT || 5555;
app.listen(PORT, () =>
  console.log(`Your App is running on http://localhost:${PORT}`)
);

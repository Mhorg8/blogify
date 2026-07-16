import express from "express";
import cookieParser from "cookie-parser";
import { connectDB, disconnectDB } from "./config/db.ts";
import authRoute from "./routes/authRoute.ts";
import blogRoute from "./routes/blogRoute.ts";
import { errorMiddleware } from "./middleware/errorMiddleware.ts";

connectDB();

const PORT = 5001;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/blog", blogRoute);
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
});

process.on("unhandledRejection", () => {
  console.log("Unhandled Rejection");
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", () => {
  console.log("Unhandled Exception");
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("Unhandled SIGTERM");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

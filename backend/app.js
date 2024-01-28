import dotenv from "dotenv";
dotenv.config({ path: "./db/.env" });
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
// console.log("cors", process.env.CORS_ORIGIN_URL);
app.use(
  cors({
    origin:process.env.CORS_ORIGIN_URL || 'https://connectmmdu-frontend.onrender.com',
    credentials: true,
  })
);

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//import routes
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import messageRouter from "./routes/message.routes.js";
import contactRouter from "./routes/contact.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/post", postRouter);

export { app };

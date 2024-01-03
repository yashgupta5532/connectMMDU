import { connectDb } from "./db/db.js";
import { app } from "./app.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: "./db/.env" });

const server = createServer(app);
const io = new Server(server);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

connectDb().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`);
  });
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("chat message", (msg) => {
    console.log("chat message event received", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


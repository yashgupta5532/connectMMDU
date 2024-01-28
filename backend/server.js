import dotenv from "dotenv";
dotenv.config({ path: "./db/.env" });
import { connectDb } from "./db/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app.js";


const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN_URL,
    credentials: true,
  },
});

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
  // console.log("userid",socket.id);
  socket.emit("welcome", "welcome to the server");
  socket.on("message", (msg) => {
    // console.log("message event received", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

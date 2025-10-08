import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "../server/src/routes/auth.route.js";
import authPost from "../server/src/routes/auth.post.js";
import messageRoute from "../server/src/routes/message.route.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { io, app, server } from "./src/lib/socket.js";
import path from "path";

// --------  Use it for "DeveLopment Mode" --------

dotenv.config();

const PORT = process.env.PORT;
const _dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://chat-io-bjln.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);

// API routes
app.use("/auth", authRoute);
app.use("/authpost", authPost);
app.use("/authmessage", messageRoute);

// Deployment code (static files for React/Vite build)
app.use(express.static(path.join(_dirname, "/client/dist")));
app.get(/^\/(?!auth).*/, (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

// Database + Server listen
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to -->", mongoose.connection.name);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });

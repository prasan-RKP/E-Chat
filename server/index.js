import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "../server/src/routes/auth.route.js";
import authPost from "../server/src/routes/auth.post.js"
import messageRoute from '../server/src/routes/message.route.js'
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import { io, app, server } from "./src/lib/socket.js"; 
dotenv.config();


const PORT = process.env.PORT;

app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    //origin: "http://192.168.146.238:5173", 
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/authpost",authPost);
app.use('/authmessage', messageRoute);

server.listen(PORT, () => {
  console.log(`I am listening on port ${PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/moonDB")
  .then(() => console.log("successfully to connected to db ✅",mongoose.connection.name))
  .catch((err) => console.log("Error occured in db connection"));

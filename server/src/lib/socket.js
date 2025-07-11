import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
     origin: ["http://localhost:5173"],
    // for mobile app testing
    //origin: ["http://192.168.146.238:5173"],
    credentials: true,
  },
});

// To store logged-in users (userId -> socketId)
const userSocketmap = {};

// Helper function to get a user's socket ID
export function getReceiverSocketId(userId) {
  return userSocketmap[userId];
}

// Main connection
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketmap)); // ✅ Notify all users
  }

  console.log("Connected Users:", userSocketmap);

  // Handle user reconnecting
  socket.on("userReconnected", (userId) => {
    if (userId) {
      userSocketmap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketmap)); // ✅ Notify all users
    }
  });

  // Handle user disconnecting manually
  socket.on("userDisconnected", (userId) => {
    if (userId) {
      delete userSocketmap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketmap)); // ✅ Notify all users
    }
  });

  // Handle socket disconnecting (auto-disconnect)
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);

    // Find the userId corresponding to the socket ID
    const userId = Object.keys(userSocketmap).find(
      (key) => userSocketmap[key] === socket.id
    );

    if (userId) {
      delete userSocketmap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketmap)); // ✅ Notify all users
    }
  });
});

export { io, server, app };

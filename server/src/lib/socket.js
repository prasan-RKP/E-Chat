

// old code of socket.js
/*
import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.VITE_FRONTEND_URL || "http://localhost:5173"],
    // for mobile app testing
    //origin: ["http://192.168.126.238:5173"],
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
  // Previous Disconnect code

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

  // New Disconnect code
});

export { io, server, app };

*/

import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.VITE_FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  },
});

// To store logged-in users (userId -> socketId)
const userSocketmap = {};

// To store typing users (conversationId -> Set of userIds)
const typingUsers = {};

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
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  }

  console.log("Connected Users:", userSocketmap);

  // Handle user reconnecting
  socket.on("userReconnected", (userId) => {
    if (userId) {
      userSocketmap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
    }
  });

  // Handle user disconnecting manually
  socket.on("userDisconnected", (userId) => {
    if (userId) {
      delete userSocketmap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
    }
  });

  // Real-Time 'Typing Indicator logic Starts here

  socket.on("typing", ({ receiverId, senderId }) => {
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("typing", { senderId });
  }
});

// Handle typing stop
socket.on("stopTyping", ({ receiverId, senderId }) => {
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("stopTyping", { senderId });
  }
});

// Real-Time 'Typing Indicator logic Ends here
  
  // Handle message deletion confirmation
  socket.on("messageDeleted", ({ messageId, conversationUsers }) => {
    conversationUsers.forEach(userId => {
      const socketId = getReceiverSocketId(userId);
      if (socketId && socketId !== socket.id) {
        io.to(socketId).emit("messageDeletedFromBoth", { messageId });
      }
    });
  });

  // Handle socket disconnecting
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);

    const userId = Object.keys(userSocketmap).find(
      (key) => userSocketmap[key] === socket.id
    );

    if (userId) {
      // Clean up typing indicators for this user
      Object.keys(typingUsers).forEach(conversationId => {
        if (typingUsers[conversationId] && typingUsers[conversationId].has(userId)) {
          typingUsers[conversationId].delete(userId);
          if (typingUsers[conversationId].size === 0) {
            delete typingUsers[conversationId];
          }
        }
      });

      delete userSocketmap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
    }
  });
});

export { io, server, app };
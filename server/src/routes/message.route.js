import express from "express";
import User from "../models/userAuthModel.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/userMessageModel.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const router = express.Router();

router.post("/removeMsg/:id", protectedRoute, async (req, res) => {
  try {
    const messageId = req.params.id;
    console.log("Deleting message with ID:", messageId);

    // Find and delete the message
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Return updated messages (so frontend can refresh the UI)
    const updatedMessages = await Message.find();
    
    //Todo relatime deletion wii be coming soon....!
    io.emit("messageDeleted", { messageId });

    return res.status(200).json(updatedMessages);
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/fetchUser", protectedRoute, async (req, res) => {
  const currentUserId = req.user._id;
  if (!currentUserId) return res.status(400).json({ message: "Invalid user" });

  try {
    const allUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
});

router.get("/getMessages/:id", protectedRoute, async (req, res) => {
  const myId = req.user._id;
  const userToChatId = req.params.id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
});

// changed for mobile support as well 
router.post("/sendMessage/:id", protectedRoute, async (req, res) => {
  const { text, image } = req.body;
  const senderId = req.user._id;
  const receiverId = req.params.id;

  let imageUrl;

  try {
    // 📸 Validate and upload image if provided
    if (image) {
      // 1. Check Base64 prefix
      const base64HeaderPattern = /^data:image\/(png|jpeg|jpg|webp);base64,/;
      if (!base64HeaderPattern.test(image)) {
        return res.status(400).json({ message: "Invalid image format. Must be Base64 with MIME type." });
      }

      // 2. Estimate Base64 file size
      const base64Data = image.split(',')[1]; // Remove "data:image/...;base64,"
      const imageFileSize = Buffer.byteLength(base64Data, "base64");
      const maxFileSize = 10 * 1024 * 1024; // 10MB

      if (imageFileSize > maxFileSize) {
        return res.status(400).json({ message: "Image too large. Max 10MB allowed." });
      }

      // 3. Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat_images", // optional folder
      });

      imageUrl = uploadResponse.secure_url;
      console.log(`✅ Uploaded Image URL: ${imageUrl}`);
    }

    // 💬 Create message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // 🔁 Notify receiver via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("❌ Error in /sendMessage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default router;

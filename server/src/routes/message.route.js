import express from "express";
import User from "../models/userAuthModel.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/userMessageModel.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import {translate} from 'google-translate-api-x' ;

const router = express.Router();

router.post("/removeMsg/:id", protectedRoute, async (req, res) => {
  try {
    const messageId = req.params.id;

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
// old "/sendMessage/:id" code
/*
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

*/

// new "/sendMessage/:id" code
router.post("/sendMessage/:id", protectedRoute, async (req, res) => {
  const { text, image } = req.body;
  const senderId = req.user._id;
  const receiverId = req.params.id;

  let imageUrl;

  try {
    if (image) {
      // Check if image is already a URL (forwarded image) or Base64 (new image)
      if (image.startsWith("http://") || image.startsWith("https://")) {
        // Image is already uploaded - just use the existing URL
        imageUrl = image;
        console.log(`✅ Using existing image URL: ${imageUrl}`);
      } else {
        // New image - validate and upload Base64
        const base64HeaderPattern = /^data:image\/(png|jpeg|jpg|webp);base64,/;
        if (!base64HeaderPattern.test(image)) {
          return res.status(400).json({
            message: "Invalid image format. Must be Base64 with MIME type.",
          });
        }

        const base64Data = image.split(",")[1];
        const imageFileSize = Buffer.byteLength(base64Data, "base64");
        const maxFileSize = 10 * 1024 * 1024; // 10MB

        if (imageFileSize > maxFileSize) {
          return res
            .status(400)
            .json({ message: "Image too large. Max 10MB allowed." });
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chat_images",
        });

        imageUrl = uploadResponse.secure_url;
        console.log(`✅ Uploaded new image: ${imageUrl}`);
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

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

//old code -> '/delete-both' Code for deleting all messages between two users (for future use)

/*

router.delete("/delete-both", protectedRoute, async (req, res) => {
  const { messageId } = req.body;
  const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Only sender can delete message from both side
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json(Message);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
*/

//New code -> '/delete-both' Code for deleting all messages between two users
router.delete("/delete-both", protectedRoute, async (req, res) => {
  const { messageId } = req.body;
  const userId = req.user._id;

  try {

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete message from both sides
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this message",
      });
    }

    // Store conversation info before deletion
    const receiverId = message.receiverId.toString();
    const senderId = message.senderId.toString();

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // Emit real-time deletion to both users
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    console.log(
      "Socket IDs - Receiver:",
      receiverSocketId,
      "Sender:",
      senderSocketId
    );

    // Notify receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeletedFromBoth", {
        messageId,
        deletedBy: userId,
        conversationWith: senderId,
      });
    }

    // Notify sender
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("messageDeletedFromBoth", {
        messageId,
        deletedBy: userId,
        conversationWith: receiverId,
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted for everyone",
      messageId: messageId,
    });
  } catch (error) {
    console.error("Error in delete-both:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid message ID format" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 'TransLation feature starts from here
router.post("/translate", protectedRoute, async (req, res) => {
  try {
    const { messageId, text, langCode } = req.body;
    const userId = req.user._id;


    // Validate inputs
    if (!text || !langCode) {
      return res.status(400).json({
        success: false,
        message: "Text and language code are required"
      });
    }

    // Optional: Verify message ownership or access (if needed)
    if (messageId) {
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found"
        });
      }

      // Check if user has access to this message
      const hasAccess = message.senderId.toString() === userId.toString() || 
                       message.receiverId.toString() === userId.toString();
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }
    }

    // Perform translation
    const translationResult = await translate(text, { 
      to: langCode,
      autoCorrect: true 
    });

    //console.log("Translation result:", translationResult);

    // Language code mappings for better display names
    const languageNames = {
  hi: "हिंदी",
  or: "ଓଡ଼ିଆ",
  te: "తెలుగు",
  ta: "தமிழ்",
  ml: "മലയാളം",
  kn: "ಕನ್ನಡ",
  gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ",
  bn: "বাংলা",
  mr: "मराठी",
  en: "English",
};

    const response = {
      success: true,
      translatedText: translationResult.text,
      sourceLanguage: languageNames[translationResult.from] || translationResult.from,
      targetLanguage: languageNames[langCode] || langCode,
      originalText: text,
      messageId: messageId || null
    };

    //console.log("Sending translation response:", response);

    res.status(200).json(response);

  } catch (error) {
    console.error("Translation error:", error);
    
    // Handle different types of errors
    let errorMessage = "Translation failed";
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = "Translation service unavailable. Please try again later.";
    } else if (error.message.includes('language')) {
      errorMessage = "Unsupported language selected";
    } else if (error.response) {
      errorMessage = error.response.data?.message || "Translation service error";
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


export default router;

// 

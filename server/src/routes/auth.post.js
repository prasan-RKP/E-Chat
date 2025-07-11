import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";
import Post from "../models/userPostModel.js";
import User from "../models/userAuthModel.js";

const router = express.Router();

router.post("/add-post", protectedRoute, async (req, res) => {
  const { title, postDesc, selectedFile } = req.body;

  try {
    // Fetching logged-in user
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    // Validate Inputs
    if (!title.trim() || !postDesc.trim() || !selectedFile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (postDesc.length < 5) {
      return res
        .status(400)
        .json({ message: "Description must be at least 5 characters" });
    }

    // Validate Image Format
    const isBase64 = /^data:image\/(png|jpeg|jpg);base64,/.test(selectedFile);
    if (!isBase64) {
      return res
        .status(400)
        .json({ message: "Invalid image format. Use PNG or JPG" });
    }

    // Convert base64 to buffer and check file size (limit: 10MB)
    const base64Str = selectedFile.split(",")[1]; // Remove metadata
    const buffer = Buffer.from(base64Str, "base64");
    const fileSizeMB = buffer.length / (1024 * 1024); // Convert bytes to MB

    if (fileSizeMB > 10) {
      return res
        .status(400)
        .json({ message: "File size too large. Maximum allowed size is 10MB" });
    }

    // Upload Image to Cloudinary
    let uploadResponse;
    try {
      uploadResponse = await cloudinary.uploader.upload(selectedFile);
    } catch (uploadError) {
      return res
        .status(500)
        .json({ message: "Image upload failed", error: uploadError.message });
    }

    // Create New Post
    const newPost = new Post({
      title: title.trim(),
      description: postDesc.trim(),
      postImage: uploadResponse.secure_url,
    });

    // Save Post to Database
    await newPost.save();

    console.log("NewPost value is", newPost);

    // Ensure 'posts' array exists, then push post ID
    if (!user.posts) user.posts = [];
    user.posts.push(newPost._id);
    await user.save();

    return res.status(201).json({
      _id: newPost._id,
      title: newPost.title,
      description: newPost.description,
      postImage: newPost.postImage,
      userId: user._id, // Include userId
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// we will handle it later
router.get("/allposts", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(400).json({ message: "Unauthorized User" });

    // ✅ Populate posts if needed, but return the whole user object
    const user = await User.findById(userId).populate("posts");
    if (!user) return res.status(400).json({ message: "Unauthorized User" });

    // ✅ Send the whole user object
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in /allposts catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;

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
      user: userId,
      ownerName: user.username || "Anonymous", // Use user's name or default to "Anonymous"
    });

    // Save Post to Database
    await newPost.save();


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
      ownerName: user.username || "Anonymous",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// This route will help to show the posts indivisual User
/*
router.get("/allposts", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(400).json({ message: "Unauthorized User" });

    
    const user = await User.findById(userId).populate("posts");
    if (!user) return res.status(400).json({ message: "Unauthorized User" });

    
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in /allposts catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

*/

router.get("/allposts", protectedRoute, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete-post", protectedRoute, async (req, res) => {
  const { postId } = req.body;
  const userId = req.user?._id;

  try {
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required ☹️" });
    }

    // 1. Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    // 2. Check ownership
    if (post?.user?._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post 🚫" });
    }

    // 3. Delete post
    const deletedPost = await Post.findByIdAndDelete(postId);

    // 4. Remove reference from user's posts array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { posts: postId } },
      { new: true }
    );

    // ✅ Return deleted post info so frontend can update UI
    return res.status(200).json({
      message: "Post deleted successfully ✅",
      deletedPost: { _id: deletedPost._id },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error ⚡" });
  }
});

// Re-correcting the 'addLikePost() ' feature
router.patch("/likePost", protectedRoute, async (req, res) => {
  const loggedInUserId = req.user?._id;
  const { authUserId, postId } = req.body;

  //console.log('Hitting from profile',authUserId, '& postId', postId);
  //Hitting from profile 689ff9d9da7653ba8798d27b & postId 68a9d82cac3773a181465517  backend accepting 

  try {
    if (!loggedInUserId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    if (!postId) {
      return res.status(400).json({ message: "Post not found" });
    }
    // if (loggedInUserId === authUserId) {
    //   return res.status(400).json({ message: "You cannot like your own post" });
    // }

    const post = await Post.findById(postId).populate(
      "user",
      "name profilePic"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let action = ""

    const alreadyLiked = post.likes.whoLiked.includes(loggedInUserId);

    if (alreadyLiked) {
      post.likes.whoLiked = post.likes.whoLiked.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );

      action = "unliked"
      
    } else {
      post.likes.whoLiked.push(loggedInUserId);
      action = "liked"
    }

    post.likes.totalLikes = post.likes.whoLiked.length;

    await post.save();

    // ✅ Return updated post
    res.json({post, action});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

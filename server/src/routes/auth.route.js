import express, { Router } from "express";
import User from "../models/userAuthModel.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../lib/webToken.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

//post signUp
router.post("/signup", async (req, res) => {
  const { username, email, contact, password } = req.body;

  try {
    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" }); // Changed 404 to 400
    }

    console.log('uservalue is', user);

    // Check if all fields are provided
    if (!username || !email || !contact || !password) {
      return res.status(400).json({ message: "Please fill your credentials" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: username,
      email: email,
      contact: Number(contact),
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      //here we have to add the email-....

      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        contact: newUser.contact,
        password: newUser.password,
        profilePic: newUser.profilePic,
        posts: newUser.posts
      });
    }
  } catch (error) {
    console.log("Error in routes folder", error);
    res.status(500).json({ message: "Failed to Register ❌" });
  }
});

//post Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(404).json({ message: "Please fill your credentials" });

    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser)
      return res.status(404).json({ message: "user not registered" });

    const isCorrectPassword = await bcryptjs.compare(
      password,
      loggedInUser.password
    );
    if (!isCorrectPassword)
      return res.status(404).json({ message: "Wrong credentials" });

    generateToken(loggedInUser._id, res);
    return res.status(200).json({
      message: "Login successfull",
      _id: loggedInUser._id,
      username: loggedInUser.username,
      email: loggedInUser.email,
      contact: loggedInUser.contact,
      password: loggedInUser.password,
      profilePic: loggedInUser.profilePic
    });
  } catch (error) {
    console.log("Error in post login", error);
    res.status(404).json({ message: "Internal server Error" });
  }
});

// check route
router.get("/check", protectedRoute, async (req, res) => {
  try {
    
     const authval = await req.user.populate('posts');
     //console.log(authval.posts);

    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error);
    return res.status(404).json({ message: "Internal server Error" });
  }
});

//logout
router.post("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Internal Server Error" });
  }
});

router.put("/profile", protectedRoute, async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Please choose an Image" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const userId = req.user._id;

    console.log('userId is', userId);

    // Check if it's a valid base64 image
    const isBase64 = /^data:image\/(png|jpeg|jpg);base64,/.test(profilePic);
    if (!isBase64) {
      return res.status(400).json({ message: "Invalid image format. Use PNG or JPG" });
    }

    // Upload to Cloudinary with size limit
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      chunk_size: 10000000, // 10MB
      resource_type: "image",
      transformation: [{ quality: "auto:good", fetch_format: "auto" }], // Optimize image
      timeout: 60000, // 60 seconds timeout
    });

    if (!uploadResponse.secure_url) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    // Update user profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Invalid User ❌" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put("/likePost", protectedRoute, async (req, res) => {
  const loggedInUserId = req?.user?.id;
  const { likedUserId } = req.body;

  try {
    if (!loggedInUserId) return res.status(400).json({ message: "Unauthorized" });
    if (!likedUserId) return res.status(400).json({ message: "Liked user ID not provided" });

    // Prevent liking yourself
    if (loggedInUserId === likedUserId) {
      return res.status(400).json({ message: "You can't like yourself" });
    }

    const likedUser = await User.findById(likedUserId);
    if (!likedUser) return res.status(404).json({ message: "User to be liked not found" });

    // Check if the user already liked
    const alreadyLiked = likedUser.likeDetails.whoLiked.includes(loggedInUserId);

    if (alreadyLiked) {
      // Remove the like
      likedUser.likeDetails.whoLiked = likedUser.likeDetails.whoLiked.filter(
        (id) => id.toString() !== loggedInUserId
      );
      likedUser.likeDetails.totalLikes -= 1;
    } else {
      // Add the like
      likedUser.likeDetails.whoLiked.push(loggedInUserId);
      likedUser.likeDetails.totalLikes += 1;
    }

    await likedUser.save();

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "User liked successfully",
      totalLikes: likedUser.likeDetails.totalLikes,
      whoLiked: likedUser.likeDetails.whoLiked,
    });
  } catch (error) {
    console.error("Error in /likePost:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});


// Todo :- We will handle it later
router.get("/fetchroute",(req, res)=> {
console.log('Hitting by  the fetchRoute');
})



export default router;

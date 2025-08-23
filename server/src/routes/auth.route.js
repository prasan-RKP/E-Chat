import express, { Router } from "express";
import User from "../models/userAuthModel.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../lib/webToken.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";
import UserSession from "../models/UserSession.js";

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

    console.log("uservalue is", user);

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
        posts: newUser.posts,
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
    // ✅ Generate JWT or session cookie
    generateToken(loggedInUser._id, res);

    //// ✅ Create a session log in DB
    await UserSession.create({
      userId: loggedInUser._id,
      loginTime: new Date(),
    });

    return res.status(200).json({
      message: "Login successfull",
      _id: loggedInUser._id,
      username: loggedInUser.username,
      email: loggedInUser.email,
      contact: loggedInUser.contact,
      password: loggedInUser.password,
      profilePic: loggedInUser.profilePic,
    });
  } catch (error) {
    console.log("Error in post login", error);
    res.status(404).json({ message: "Internal server Error" });
  }
});

// check route
router.get("/check", protectedRoute, async (req, res) => {
  try {
    const authval = await req.user.populate("posts");
    //console.log(authval.posts);

    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error);
    return res.status(404).json({ message: "Internal server Error" });
  }
});

//The logout route is updated with 'userSession' to log the logout time and calculate the session duration
router.post("/logout", protectedRoute, async (req, res) => {
  console.log("Hitting the logout route");
  try {
    const userId = req.user._id; // ✅ assuming protectedRoute middleware attaches user to req

    // Find the latest active session for this user
    const session = await UserSession.findOne({
      userId,
      logoutTime: null,
    }).sort({ loginTime: -1 });

    if (session) {
      session.logoutTime = new Date();
      session.durationMinutes = Math.floor(
        (session.logoutTime - session.loginTime) / 60000
      );
      await session.save();
    }

    // Clear JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });

    return res.status(200).json({
      message: "Logout successful",
      duration: session ? session.durationMinutes : 0,
    });
  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to update user profile picture
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

    console.log("userId is", userId);

    // Check if it's a valid base64 image
    const isBase64 = /^data:image\/(png|jpeg|jpg);base64,/.test(profilePic);
    if (!isBase64) {
      return res
        .status(400)
        .json({ message: "Invalid image format. Use PNG or JPG" });
    }

    // Upload to Cloudinary with size limit
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      chunk_size: 10000000, // 10MB
      resource_type: "image",
      transformation: [{ quality: "auto:good", fetch_format: "auto" }], // Optimize image
      timeout: 60000, // 60 seconds timeout
    });

    if (!uploadResponse.secure_url) {
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary" });
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

// Route for "/likePost"
router.patch("/likePost", protectedRoute, async (req, res) => {
  const loggedInUserId = req?.user?.id;
  const { likedUserId } = req.body;
  console.log("gettting userTobeLiked Id", likedUserId);

  try {
    if (!loggedInUserId)
      return res.status(400).json({ message: "You are not LoggedIn.." });
    if (!likedUserId)
      return res.status(400).json({ message: "Liked user ID not Found.." });

    // Prevent liking yourself
    if (loggedInUserId.toString() === likedUserId.toString()) {
      return res.status(400).json({ message: "You can't like yourself.." });
    }

    const likedUser = await User.findById(likedUserId);
    if (!likedUser)
      return res.status(404).json({ message: "User to be liked not found.." });

    // Check if the user already liked
    const alreadyLiked = likedUser.likes.whoLiked.includes(loggedInUserId);

    if (alreadyLiked) {
      likedUser.likes.whoLiked = likedUser.likes.whoLiked.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );
    } else {
      likedUser.likes.whoLiked.push(loggedInUserId);
    }

    // ✅ Keep count consistent
    likedUser.likes.totalLikes = likedUser.likes.whoLiked.length;

    await likedUser.save();

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "User liked successfully",
      totalLikes: likedUser.likes.totalLikes,
      whoLiked: likedUser.likes.whoLiked,
    });
  } catch (error) {
    console.error("Error in /likePost:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
});

// Todo :- We will handle it later
router.get("/fetchroute", (req, res) => {
  console.log("Hitting by  the fetchRoute");
});

router.get("/fetch-chart", protectedRoute, async (req, res) => {
  const userId = req.user._id;

  try {
    // Add await to execute the query and get the results`
    // TODO:- it will show only 1day before data , logic is pending
    // Logic Flow: suppose today is 17/8/25 it will only show data from 16/8/25 all data .
    // TODO:- The issue if the user is loggedIn and loggedOut in same days but the graph is only showing one data .
    const userSessions = await UserSession.find({ userId }); // Filter by userId

    if (!userSessions || userSessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for this user" });
    }

    //console.log("The user sessions are:", userSessions);
    res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res
      .status(500)
      .json({ message: "Error fetching user sessions", error: error.message });
  }
});

router.patch("/follow", protectedRoute, async (req, res) => {
  const { fid } = req.body; // id of the user to follow/unfollow
  const userId = req.user?.id; // logged-in user id

  try {
    if (!fid)
      return res.status(400).json({ message: "Followed user not found" });
    if (fid === userId)
      return res.status(400).json({ message: "You can't follow yourself" });

    const user = await User.findById(userId);
    const targetUser = await User.findById(fid);

    if (!user || !targetUser)
      return res.status(404).json({ message: "User not found" });

    // check if already following BEFORE update
    const isAlreadyFollowing = user.following.some(
      (id) => id.toString() === fid
    );

    let action = "";
    if (isAlreadyFollowing) {
      // UNFOLLOW
      await User.findByIdAndUpdate(userId, { $pull: { following: fid } });
      await User.findByIdAndUpdate(fid, { $pull: { followers: userId } });
      action = "unfollowed";
    } else {
      // FOLLOW
      await User.findByIdAndUpdate(userId, { $addToSet: { following: fid } });
      await User.findByIdAndUpdate(fid, { $addToSet: { followers: userId } });
      action = "followed";
    }

    const refreshedUser = await User.findById(userId)
      .select("-password")
      .populate("following", "username profilePic")
      .populate("followers", "username profilePic");

    return res.status(200).json({
      status: "success",
      action, // 👈 either "followed" or "unfollowed"
      user: refreshedUser,
    });
  } catch (error) {
    console.error("Error in follow/unfollow:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

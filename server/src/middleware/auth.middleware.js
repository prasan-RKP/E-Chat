import jwt from "jsonwebtoken";
import User from "../models/userAuthModel.js";
import dotenv from "dotenv";
import UserSession from "../models/UserSession.js";

dotenv.config();

// Old protectedRoute code

/*

export const protectedRoute = async (req, res, next) => {
  try {

    //console.log("Hitting the middleware");

    const token = req.cookies.jwt;

    if (!token) return res.status(400).json({ message: "UnAuthorized User" });

    const decodeduser = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeduser)
      return res.status(400).json({ message: "UnAuthorized User" });

    

    const orgUser = await User.findById(decodeduser.userId).select("-password");
    if (!orgUser) return res.status(400).json({ message: "Invalid User" });

    req.user = orgUser;
    next();
  } catch (error) {
    return res.status(404).json({ message: "Internal server Error" });
  }
};

*/

// New protectedRoute code with session management
export const protectedRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "No token → Unauthorized" });
  }

  try {
    // Try to verify
    const decodeduser = jwt.verify(token, process.env.JWT_SECRET);
    const orgUser = await User.findById(decodeduser.userId).select("-password");
    if (!orgUser) return res.status(400).json({ message: "Invalid User" });

    req.user = orgUser;
    next();
  } catch (err) {
    console.error("JWT error type:", err.name, err.message); // 👀 log error type

    if (err.name === "TokenExpiredError") {
      // ✅ Handle expired token
      const decoded = jwt.decode(token);
      if (decoded?.userId) {
        const session = await UserSession.findOne({
          userId: decoded.userId,
          logoutTime: null,
        }).sort({ loginTime: -1 });

        if (session) {
          session.logoutTime = new Date();
          session.durationMinutes = Math.floor(
            (session.logoutTime - session.loginTime) / 60000
          );
          await session.save();
        }
      }

      // Clear cookie
      res.cookie("jwt", "", { maxAge: 0 });
      return res.status(401).json({ message: "Session expired" });
      //Window.reload();
    }

    return res.status(401).json({ message: "Unauthorized User" });
  }
};

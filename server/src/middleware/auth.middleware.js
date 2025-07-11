import jwt from "jsonwebtoken";
import User from "../models/userAuthModel.js";
import dotenv from 'dotenv';

dotenv.config();

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

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "8d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  //For mobile testing...
    // res.cookie("jwt", token, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "lax", // ✅ allows cookies on cross-origin GET/POST from same-site
    //   secure: false, // ✅ must be false for local development (no HTTPS)
    // });
  return token;
};

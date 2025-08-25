// WebToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId, res) => {
  // JWT expiry set to 1 hour 5 minutes
  const expiryMinutes = 65; // 1 hour 5 min

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: `${expiryMinutes}m`, // token expires in 1 hour 5 min
  });

  // Cookie expiry set to 1 hour 15 minutes (10 min extra)
  res.cookie("jwt", token, {
    maxAge: (expiryMinutes + 12) * 60 * 1000, // 1 hour 15 min in ms
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

//For mobile testing...
// res.cookie("jwt", token, {
//   maxAge: expiryMinutes * 60 * 1000,
//   httpOnly: true,
//   sameSite: "lax", // ✅ allows cookies on cross-origin GET/POST from same-site
//   secure: false, // ✅ must be false for local development (no HTTPS)
// });

//for laptop/PC testing...
// res.cookie("jwt", token, {
//     maxAge: (expiryMinutes + 10) * 60 * 1000, // 1 hour 15 min in ms
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });

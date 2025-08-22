// WebToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId, res) => {
  // JWT expiry set to 2 minutes
  const expiryMinutes = 54;

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: `${expiryMinutes}m`, // 👈 token expires in 2 minutes
  });

  // Cookie expiry set to 3 minutes
  res.cookie("jwt", token, {
    maxAge: (expiryMinutes + 5) * 60 * 1000, // 3 minutes in ms
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

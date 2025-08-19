import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId, res) => {
  const expiryMinutes = 40;

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: `${expiryMinutes}m`, // ✅ JWT expires in 40 minutes
  });

  res.cookie("jwt", token, {
    maxAge: expiryMinutes * 60 * 1000, // ✅ 40 minutes in ms
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

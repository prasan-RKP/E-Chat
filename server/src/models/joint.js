import mongoose from "mongoose";
import User from "./userAuthModel.js";
import dotenv from "dotenv";
dotenv.config();
const addMissingFields = async () => {
  try {
    // connect to MongoDB (replace with your connection string)
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moonDB",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    await User.updateMany(
      {
        $or: [
          { followers: { $exists: false } },
          { following: { $exists: false } },
        ],
      },
      {
        $set: { followers: [], following: [] },
      }
    );

    console.log("✅ All users updated with 'followers' and 'following'");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating users:", error);
    mongoose.connection.close();
  }
};

addMissingFields();

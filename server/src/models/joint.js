import mongoose from "mongoose";
import User from "./userAuthModel.js";
import dotenv from "dotenv";
dotenv.config();

const addMissingFields = async () => {
  try {
    // connect to MongoDB
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
          { passion: { $exists: false } },
          { location: { $exists: false } },
          { profileLink: { $exists: false } },
        ],
      },
      {
        $set: {
          passion: "",
          location: "",
          profileLink: "",
        },
      }
    );

    console.log("✅ All users updated with 'passion', 'location', and 'profileLink'");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating users:", error);
    mongoose.connection.close();
  }
};

addMissingFields();

import mongoose from "mongoose";
import User from "./userAuthModel.js";
import dotenv from "dotenv";
dotenv.config();

const removeUserLikesField = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moonDB",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");
    
    // First, let's check what the likes field structure looks like
    const usersWithLikes = await User.find({ likes: { $exists: true } }).limit(1);
    console.log("Sample likes structure:", usersWithLikes[0]?.likes);
    
    // Remove "likes" field from all User documents - use the correct $unset syntax
    const result = await User.updateMany(
      { likes: { $exists: true } },
      { $unset: { likes: 1 } } // Use 1 instead of empty string
    );

    console.log(`✅ ${result.modifiedCount} users updated: 'likes' field removed`);
    
    // Verify removal
    const stillWithLikes = await User.countDocuments({ likes: { $exists: true } });
    console.log(`Users still with 'likes' field: ${stillWithLikes}`);
    
    if (stillWithLikes > 0) {
      console.log("Trying alternative approach...");
      
      // Alternative approach: Use MongoDB native driver directly
      const db = mongoose.connection.db;
      const updateResult = await db.collection('users').updateMany(
        { likes: { $exists: true } },
        { $unset: { likes: "" } }
      );
      
      console.log(`Alternative approach updated ${updateResult.modifiedCount} documents`);
      
      // Check again
      const finalCheck = await User.countDocuments({ likes: { $exists: true } });
      console.log(`Final check - users with 'likes' field: ${finalCheck}`);
    }
    
    // Show a sample document
    const sampleUser = await User.findOne({});
    console.log('Sample user document:', JSON.stringify(sampleUser.toObject(), null, 2));
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating users:", error);
    mongoose.connection.close();
  }
};

removeUserLikesField();
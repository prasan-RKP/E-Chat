import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    contact: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    // messages:[
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Message"
    //   }
    // ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

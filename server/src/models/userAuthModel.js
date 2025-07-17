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

    // Todo:- We will do it later
    // likeDetails: {
    //   whoLiked: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User", // Assuming likes are from other users
    //     },
    //   ],
    //   totalLikes: {
    //     type: Number,
    //     default: 0,
    //   },
    // },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    postImage: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    ownerName: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

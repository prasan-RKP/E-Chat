import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Home,
  MessageCircle,
  Image,
  LogOut,
  Loader,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";

const AddPost = () => {
  const [postData, setPostData] = useState({
    postDesc: "",
    title: "",
    selectedFile: null,
  });
  const [fileName, setFileName] = useState(""); // Store selected file name

  const { authUser, logout } = useAuthStore();
  const { addPost, uploadingPost } = usePostStore();

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      setFileName(file.name);
      setPostData((prevState) => ({
        ...prevState,
        selectedFile: base64Image,
      }));
    };
    reader.readAsDataURL(file);
  };

  const isValidForm = () => {
    if (!postData.title) return toast.error("Post title required.");
    if (!postData.postDesc) return toast.error("Post description is required.");
    if (postData.postDesc.length < 5)
      return toast.error("Description must have at least 5 characters.");
    if (!postData.selectedFile)
      return toast.error("Please choose your post image.");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValidForm() === true) {
      await addPost(postData);
      setPostData({
        postDesc: "",
        title: "",
        selectedFile: null,
      });
      setFileName("");
      navigate("/profile");
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-4 flex justify-between items-center text-white"
      >
        <div className="font-bold text-lg text-indigo-400">AppName</div>
        <div className="flex space-x-4 sm:space-x-6">
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.1, color: "#4c6ef5", rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="text-white"
            >
              <Home size={24} />
            </motion.button>
          </Link>
          <Link to="/allposts">
            <motion.button
              whileHover={{ scale: 1.1, color: "#4c6ef5", rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="text-white"
            >
              <Image size={24} />
            </motion.button>
          </Link>
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.1, color: "#4c6ef5", rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="text-white"
            >
              <MessageCircle size={24} />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1, color: "#e53e3e", rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="text-white"
            onClick={() => logout(navigate)}
          >
            <LogOut size={24} />
          </motion.button>
        </div>
      </motion.div>

      {/* Add Post Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-400">Create a Post</h2>
            <Link to="/profile">
              <motion.button
                whileHover={{ scale: 1.2 }}
                className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition"
              >
                <X size={20} />
              </motion.button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              placeholder="Add Post Title"
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={postData.postDesc}
              onChange={(e) =>
                setPostData({ ...postData, postDesc: e.target.value })
              }
              placeholder="Write your post desc here..."
              className="w-full h-32 p-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>

            {/* File Upload Section */}
            <div className="relative border-2 border-dashed border-gray-600 p-5 rounded-lg text-center overflow-hidden">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <motion.div whileHover={{ scale: 1.1 }}>
                <Upload size={40} className="text-indigo-400 mx-auto" />
                {fileName ? (
                  <p className="text-indigo-300 mt-2 break-words text-sm max-w-full truncate">
                    {fileName}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Upload your post image 📷
                  </p>
                )}
              </motion.div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              className="w-full bg-indigo-600 p-3 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition"
            >
              {uploadingPost ? (
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                "Post"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AddPost;

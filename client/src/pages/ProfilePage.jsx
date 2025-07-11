import React, { useEffect, useState } from "react";
import "../stylesheets/myCustom.css";
import {
  HomeIcon,
  MessageCircle,
  Images,
  LogOut,
  Menu,
  Camera,
  PlusCircle,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useNavigate } from "react-router-dom";
import TabNavigation from "../Components/TabNavigation.jsx";
import Footer from "../Components/Footer.jsx";

const ProfilePage = () => {
  const { isProfileUploading, authUser, logout, updateProfile, checkAuth } =
    useAuthStore();
  const [selectedImage, setSelectedImage] = useState("");

  // Handle image selection and convert to base64
  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        updateProfile({ profilePic: reader.result });
      };
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 text-[#e6af65] flex flex-col font-[Poppins]">
      {/* Navigation Bar */}
      <nav className="bg-gray-300 p-4 shadow-lg flex justify-between items-center border-b border-gray-400 text-gray-900">
        <span className="text-2xl font-extrabold tracking-wide">Chat-i</span>
        <ul className="hidden sm:flex space-x-6 items-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="hover:text-purple-950"
            >
              <HomeIcon size={24} />
            </motion.button>
          </Link>
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="hover:text-purple-950"
            >
              <MessageCircle size={24} />
            </motion.button>
          </Link>
          <Link to="/allposts">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="hover:text-fuchsia-950"
            >
              <Images size={24} />
            </motion.button>
          </Link>
          <motion.button
            onClick={()=> logout(navigate)}
            whileHover={{ scale: 1.1 }}
            className="bg-green-400 px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:bg-red-700 transition"
          >
            <LogOut size={20} className="mr-2 hidden sm:inline" /> Logout
          </motion.button>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-10 space-y-6">
        <motion.div
          className="relative group w-40 h-40 cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-full h-full rounded-full shadow-lg flex items-center justify-center overflow-hidden relative">
            {isProfileUploading ? (
              <div className="text-slate-800 animate-spin">
                <Loader size={28} />
              </div>
            ) : (
              <img
                src={
                  authUser.profilePic ||
                  "https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg?ga=GA1.1.609031703.1716957572&semt=ais_hybrid"
                }
                className="w-full h-full object-cover"
                alt="Profile"
              />
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="absolute bottom-2 right-2 bg-slate-800 p-2 rounded-full shadow-md hover:bg-slate-700 transition text-white"
            onClick={() => document.getElementById("profileChangeId").click()}
          >
            <Camera size={20} />
          </motion.button>
        </motion.div>
        <input
          type="file"
          id="profileChangeId"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <motion.div
          className="max-w-lg text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="my-chick text-3xl font-bold text-slate-800">
            {authUser?.username}
          </h2>
          <p className="my-poke text-lg text-gray-700 mt-2">
            "I am a dedicated writer known for compelling storytelling in poem.
            With a background in Film industry, they have authored 20/40 works"
          </p>
        </motion.div>
        <Link to="/addpost">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-6 bg-slate-800 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-md flex items-center gap-2 hover:bg-slate-800 transition-transform"
          >
            <PlusCircle size={24} /> Add Post
          </motion.button>
        </Link>
        <TabNavigation />
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;

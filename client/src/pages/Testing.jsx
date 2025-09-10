import { Home, LogOut, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { usePostStore } from "../store/usePostStore.js";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";

import "../stylesheets/myCustom.css";
import PostCarousel from "../assets/PostCarousel.jsx";

const Posts = () => {
  const { authUser, logout } = useAuthStore();
  const { showPost, fetchingPosts } = usePostStore();
  const [user, setUser] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const naviagte = useNavigate();


  useEffect(() => {
    showPost();
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);


  const handlePostClick = (index) => {
    setActiveIndex(index);
    setShowCarousel(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide text-purple-400">
          MyApp
        </h1>
        <div className="flex gap-6 items-center">
          <Link to={"/"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-md hover:bg-gray-700 transition-all"
            >
              <Home size={26} />
            </motion.button>
          </Link>

          <Link to={"/profile"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-md hover:bg-gray-700 transition-all"
            >
              <UserCircle size={28} />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={()=> logout(naviagte)}
            className="p-2 rounded-md hover:bg-red-600 transition-all"
          >
            <LogOut size={26} />
          </motion.button>
        </div>
      </nav>

      {/* Midsection: Posts Grid */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {fetchingPosts ? (
          Array.from({ length: 8 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        ) : user?.length > 0 ? (
          user?.map((post, index) => (
            <motion.div
              key={post._id}
              className="relative group overflow-hidden rounded-xl shadow-xl cursor-pointer bg-gray-800"
              whileHover={{ scale: 1.05 }}
              onClick={() => handlePostClick(index)}
            >
              <motion.img
                src={post.postImage}
                alt={post.title}
                className="w-full h-[290px] object-cover transition-all duration-300 group-hover:blur-md group-hover:scale-110"
              />
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 text-white text-center opacity-0 transition-all duration-300 group-hover:opacity-100 p-4">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm">{post.description}</p>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-center text-gray-400 mt-4">No posts found.</p>
          </div>
        )}
      </div>

      {/* ✅ Render Carousel if Open */}
      {showCarousel && (
        <PostCarousel
          posts={user.posts}
          onClose={() => setShowCarousel(false)}
          initialIndex={activeIndex}
        />
      )}
    </div>
  );
};

export default Posts;

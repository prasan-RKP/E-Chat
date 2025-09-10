import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Play, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const PostCard = ({ post, isDarkMode, itemVariants, likingId, handleAddLike }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className={`relative aspect-square ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-700"
          : "bg-gradient-to-br from-gray-100 to-gray-200"
      } rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500`}
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Image with loader */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      )}
      <img
        src={post?.postImage}
        alt={`Post ${post?.title}`}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {post.isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="w-10 h-10 text-white opacity-80" />
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-white/70 dark:bg-slate-800/70 rounded-xl px-3 py-2 shadow-lg transition-all duration-300">
        {likingId === post?._id ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div onClick={() => handleAddLike(post)} className="flex items-center gap-3 cursor-pointer">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {typeof post.likes === "object"
                ? post?.likes?.totalLikes ?? 0
                : post?.likes ?? 0}
            </span>
          </div>
        )}

        <Link to="/chat" className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-blue-500" />
        </Link>
      </div>
    </motion.div>
  );
};

export default PostCard;

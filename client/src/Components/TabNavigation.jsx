import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import "../stylesheets/myCustom.css";
import "../stylesheets/title.css";

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([]);
  const { authUser } = useAuthStore();

  const tabs = ["Posts", "Photos", "Community"];

  useEffect(() => {
    fetch("https://dummyjson.com/quotes?limit=30")
      .then((res) => res.json())
      .then((data) => setCommunityPosts(data.quotes));
  }, []);

  return (
    <div className="w-full md:w-4/5 mx-auto mt-6 bg-gray-300 p-4 rounded-lg shadow-md flex flex-col md:flex-row">
      {/* Sidebar (Mobile) */}
      <div className="md:hidden relative w-full mb-4">
        <button
          className="text-gray-900 p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            className="absolute left-0 top-10 bg-gray-300 shadow-lg p-4 rounded-lg w-40"
          >
            <ul className="text-gray-900 space-y-2">
              <li className="cursor-pointer hover:text-indigo-950">Add Bio</li>
              <li className="cursor-pointer hover:text-indigo-950">
                Make Post
              </li>
              <li className="cursor-pointer hover:text-indigo-950">Reels</li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Navigation Tabs and Content */}
      <div className="flex-1">
        <div className="flex justify-around border-b border-gray-400 pb-2">
          {tabs.map((tab) => (
            <motion.div
              key={tab}
              className={`cursor-pointer text-lg font-semibold text-gray-900 pb-1 relative ${
                activeTab === tab ? "text-[#e6af65]" : "hover:text-indigo-950"
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 w-full h-1 bg-[#e6af65]"
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="p-4 text-gray-900 text-center font-medium">
          {activeTab === "Posts" && (
            <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
              {authUser?.posts?.length > 0 ? (
                authUser.posts.map((post, index) => (
                  <div
                    key={index}
                    className="carousel-item p-4 w-full sm:w-[90%] md:w-[380px]  shadow-lg rounded-lg flex flex-col items-center"
                  >
                    <img
                      src={post.postImage}
                      alt="Post"
                      className="w-full h-[280px] object-cover rounded-lg"
                    />
                    <div className="text-center mt-2 w-full">
                      <h3 className="text-lg text-red-800 font-semibold">
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-500 block">
                        {new Date(post.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No posts available.</p>
              )}
            </div>
          )}

          {activeTab === "Photos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {authUser?.posts?.length > 0 ? (
                authUser.posts.map((post, index) => (
                  <div
                    key={index}
                    className="relative group w-full aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={post.postImage}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="my-mayan text-white text-lg font-bold">
                        {post.title}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-40 w-full">
                  <p className="text-gray-600 text-center">
                    No photos uploaded.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "Community" && (
            <div className="p-4 text-gray-900">
              {communityPosts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
                  {communityPosts.map((post, index) => (
                    <div
                      key={index}
                      className="card bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center gap-4 p-5 min-h-[180px] transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                      <img
                        src={
                          post.userProfileImage ||
                          "https://cdn.pixabay.com/photo/2016/11/19/17/28/art-1840481_1280.jpg"
                        }
                        alt="User"
                        className="rounded-full w-16 h-16 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="my-india text-lg font-semibold">
                          ❝{post.author}❞
                        </h3>
                        <p className="my-poke text-gray-600">{post.quote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No community posts available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default TabNavigation;

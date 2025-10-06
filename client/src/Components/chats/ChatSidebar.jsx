import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SlUserFollow } from "react-icons/sl";
import { LuUserRoundPlus } from "react-icons/lu";
import { LuUserRoundMinus } from "react-icons/lu";
import { Loader2 } from "lucide-react";
import { IoMdRefresh } from "react-icons/io";
import "../../stylesheets/title.css";


const ChatSidebar = () => {
  const { selectedUser, getUsers, users, setSelectedUser, setIsSidebarOpen, isSidebarOpen, isUserLoading } = useChatStore();
  const { onlineUsers, followFeature, authUser } = useAuthStore();
  const navigate = useNavigate();

  const [filterOnline, setFilterOnline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState('');
  const [localFollowing, setLocalFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageModal, setImageModal] = useState({ isOpen: false, src: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);


  //sidebar out click closed -> starts 
  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, setIsSidebarOpen]);
  //sidebar out click closed -> End 
  const fetchUsers = useCallback(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sync local following state with auth user
  useEffect(() => {
    if (authUser?.following) {
      setLocalFollowing(authUser.following);
    }
  }, [authUser?.following]);

  const filteredUsers = filterOnline
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Filter users based on search query
  const searchFilteredUsers = filteredUsers.filter((user) =>
    user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // HandleFollow the follow button click with local optimistic updates
  const handleFollow = async (userId) => {
    try {
      setLoadingUserId(userId);

      // Check if currently following using local state
      const isCurrentlyFollowing = localFollowing?.some((followedUser) => {
        const followedId = typeof followedUser === 'object' ? followedUser._id : followedUser;
        return followedId.toString() === userId.toString();
      });

      // Optimistic update - update local state immediately
      const updatedFollowing = isCurrentlyFollowing
        ? localFollowing.filter((followedUser) => {
          const followedId = typeof followedUser === 'object' ? followedUser._id : followedUser;
          return followedId.toString() !== userId.toString();
        })
        : [...localFollowing, userId];

      // Update local state for instant UI update
      setLocalFollowing(updatedFollowing);

      // Make API call
      await followFeature({ fid: userId });

    } catch (error) {
      console.log("Follow/Unfollow error:", error);
      toast.error("Something went wrong!");

      // Rollback local state on error
      setLocalFollowing(authUser?.following || []);
    } finally {
      setLoadingUserId('');
    }
  }

  return (
    <div
      ref={sidebarRef}
      className={`my-mayan fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative`}
    >
      {/* Header - Fixed at top */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-300">ConneXo</h2>
        <div className="flex items-center gap-4">
          <button
            className=" text-blue-400 hover:text-white"
            onClick={async () => {
              setIsRefreshing(true);          // start spinning
              await fetchUsers();             // reload users
              setIsRefreshing(false);         // stop spinning
              // toast.success("Sidebar reloaded!");
            }}
          >
            <IoMdRefresh className={`w-6 h-6 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <button className="sm:hidden text-red-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-white" onClick={() => setIsModalOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Online Filter Toggle - Fixed */}
      <div className="p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Show Online Only</span>
          <div
            className={`relative w-12 h-6 rounded-full cursor-pointer flex items-center transition-all duration-300 
              ${filterOnline ? "bg-blue-500" : "bg-gray-600"}`}
            onClick={() => setFilterOnline(!filterOnline)}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 
                ${filterOnline ? "translate-x-6" : "translate-x-1"}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Search Bar - Fixed */}
      <div className="px-4 pb-4 flex-shrink-0">
        <input
          type="text"
          className="w-full h-11 rounded-xl pl-4 mb-2 bg-gray-700 text-gray-300 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Find your Friend ... 🙋‍♀️"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2 relative">
          {isUserLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-600 rounded-md"></div>
                </div>
                <div className="w-4 h-4 bg-gray-600 rounded-full flex-shrink-0"></div>
                <div className="w-6 h-6 bg-gray-600 rounded flex-shrink-0"></div>
              </div>
            ))
          ) : searchFilteredUsers.length > 0 ? (
            searchFilteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);

              // Fixed: Check if THIS specific user is being followed using local state
              const isAlreadyFollowing = localFollowing?.some((followedUser) => {
                const followedId = typeof followedUser === 'object' ? followedUser._id : followedUser;
                return followedId.toString() === user._id.toString();
              });

              return (
                <motion.div
                  key={user._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsSidebarOpen(false);
                  }}
                >
                  {/* Profile Picture */}
                  <img
                    src={user.profilePic || "/dfp.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700 shadow-md flex-shrink-0 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting user when clicking image
                      setImageModal({ isOpen: true, src: user?.profilePic || "/dfp.png" });
                    }}
                  />

                  {/* Username - Flexible width */}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-300 block truncate">
                      {user?.username?.length > 11
                        ? `${user.username.slice(0, 11)}...`
                        : user?.username}
                    </span>
                  </div>

                  {/* Online Status - Fixed width */}
                  <span
                    className={`w-4 h-4 rounded-full flex-shrink-0 ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
                  ></span>

                  {/* Follow Button - Fixed width */}
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {selectedUser === null ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening chat when clicking follow button
                          handleFollow(user?._id);
                        }}
                        className="cursor-pointer"
                      >
                        {loadingUserId === user?._id ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isAlreadyFollowing ? (
                          <LuUserRoundMinus className="w-6 h-6 text-red-400 hover:text-red-300" />
                        ) : (
                          <LuUserRoundPlus className="w-6 h-6 text-green-400 hover:text-green-300" />
                        )}
                      </span>
                    ) : (
                      <div className="w-6 h-6"></div>
                      /* Empty space to maintain alignment when no follow button */
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : searchQuery ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center text-gray-400 mt-10"
            >
              <p className="text-sm text-gray-500">No users found matching "{searchQuery}" 🔍</p>
              <p className="text-xs text-gray-600 mt-2">Try a different search term</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center text-gray-400 mt-10"
            >
              <p className="text-sm text-gray-500">No online users at the moment ☁️.</p>
            </motion.div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50"
            >
              <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700 w-64 mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">Options</h3>
                  <button
                    className="text-gray-400 hover:text-red-400"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      toast.info("Feature coming soon! 🚧");
                      setIsModalOpen(false);
                    }}
                    className="text-left text-gray-300 hover:text-blue-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    Create Group +
                  </button>
                  <button
                    onClick={() => {
                      toast.info("Settings coming soon! 🚧");
                      setIsModalOpen(false);
                    }}
                    className="text-left text-gray-300 hover:text-yellow-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* This modal is to show the 'profileImage' */}
        <AnimatePresence>
          {imageModal.isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md bg-black/20"
            >
              <div className="relative">
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 bg-gray-800/70 text-white rounded-full p-2 hover:bg-red-500 transition"
                  onClick={() => setImageModal({ isOpen: false, src: "" })}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Profile Image */}
                <img
                  src={imageModal.src}
                  alt="Profile"
                  className="max-w-[90vw] max-h-[80vh] rounded-2xl shadow-2xl border  object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ChatSidebar;
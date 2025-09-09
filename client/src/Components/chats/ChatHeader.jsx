import React, { useEffect, useState } from "react";
import { X, Menu, Home, User, LogOut, Images, Loader2, Search } from "lucide-react";
import { useChatStore } from "../../store/useChatStore.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { toast } from "sonner";
import { SlUserFollow, SlUserFollowing, SlUserUnfollow } from "react-icons/sl";
import { GrView } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
import "../../stylesheets/myCustom.css";


const ChatHeader = () => {
  const { setSelectedUser, selectedUser, setIsSidebarOpen } = useChatStore();
  const { logout, followFeature, isFollowing, authUser } = useAuthStore();
  const [loadingUserId, setLoadingUserId] = useState('');
  const [localFollowing, setLocalFollowing] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);


  const navigate = useNavigate();

  // Sync local following state with auth user
  useEffect(() => {
    if (authUser?.following) {
      setLocalFollowing(authUser?.following);
    }
  }, [authUser?.following]);

  // Check if already following using local state for instant updates
  const isAlreadyFollowing = React.useMemo(() => {
    if (!localFollowing || !selectedUser?._id) return false;

    return localFollowing.some((followedUser) => {
      // Handle both populated objects and ObjectId strings
      const followedId = typeof followedUser === 'object' ? followedUser._id : followedUser;
      return followedId.toString() === selectedUser?._id.toString();
    });
  }, [localFollowing, selectedUser?._id]);

  // 'handleFollow' with optimistic UI updates
  const handleOnFollow = async (id) => {
    try {
      setLoadingUserId(id);

      // Check current follow status using local state
      const isCurrentlyFollowing = localFollowing?.some((followedUser) => {
        const followedId = typeof followedUser === 'object' ? followedUser?._id : followedUser;
        return followedId.toString() === id.toString();
      });

      // Optimistic update - update local state immediately
      const updatedFollowing = isCurrentlyFollowing
        ? localFollowing.filter((followedUser) => {
          const followedId = typeof followedUser === 'object' ? followedUser?._id : followedUser;
          return followedId.toString() !== id.toString();
        })
        : [...localFollowing, id];

      // Update local state for instant UI update
      setLocalFollowing(updatedFollowing);

      // Make API call
      await followFeature({ fid: id });

    } catch (error) {
      console.error('Follow/Unfollow error:', error);
      toast.error("Something went wrong!");

      // Rollback local state on error
      setLocalFollowing(authUser?.following || []);
    } finally {
      setLoadingUserId('');
    }
  };

  // 'visitUser' functionality can be added here
  return (
    <div className="bg-gray-800 shadow-md p-4">
      <div className={`flex items-center ${selectedUser ? 'justify-between' : 'justify-between'} gap-1.5 min-w-0`}>
        {/* Left Section - Sidebar Toggle & Chat Info */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <button className="sm:hidden text-gray-300 hover:text-white flex-shrink-0" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          {selectedUser && (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 max-w-[calc(100vw-120px)] sm:max-w-none overflow-hidden">
              <img
                src={selectedUser?.profilePic || "/dfp.png"}
                alt={selectedUser?.username}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-700 shadow-md flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsImageModalOpen(true)}
              />
              <>
                {/* Mobile (smaller than sm breakpoint) */}
                <h2 className="block sm:hidden text-base font-bold text-gray-300 truncate min-w-0  my-straw">
                  {selectedUser?.username?.length > 12
                    ? selectedUser?.username.slice(0, 12) + "..."
                    : selectedUser?.username}
                </h2>

                {/* Tablet / PC (sm and above) */}
                <h2 className="hidden sm:block text-sm font-bold text-gray-300 truncate min-w-0">
                  {selectedUser?.username}
                </h2>
              </>
            </div>
          )}
        </div>

        {/* Right Section - Icons or Close Button */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          {!selectedUser && (
            <>
              <button onClick={() => navigate("/")} className="text-gray-300 hover:text-blue-900">
                <Home className="w-6 h-6" />
              </button>
              <button onClick={() => navigate("/profile")} className="text-gray-300 hover:text-cyan-500">
                <User className="w-6 h-6" />
              </button>
              <button onClick={() => navigate("/allposts")} className="text-gray-300 hover:text-green-700">
                <Images className="w-6 h-6" />
              </button>
              <button onClick={() => logout(navigate)} className="text-gray-300 hover:text-red-800">
                <LogOut className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Code has changed from here beacuse of extra button added '<search />  */}

          {selectedUser && (
            <>
              {/* ---------- For Tablet & PC (≥ sm) ---------- */}
              <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                {/* Search */}
                <button onClick={()=> toast.info("feature coming soon..")} className="cursor-pointer p-2 bg-blue-400 text-white rounded-full hover:bg-blue-600 transition-all flex-shrink-0">
                  <Search className="w-5 h-5" />
                </button>

                {/* Visit-user */}
                <Link
                  to={`/visit-user/${selectedUser?._id}`}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex-shrink-0"
                >
                  <GrView className="w-5 h-5" />
                </Link>

                {/* Follow / Unfollow */}
                <button
                  className="px-2.5 py-2.5 bg-gradient-to-r from-slate-500 to-slate-700 
            text-gray-200 font-semibold rounded-full shadow-md 
            hover:from-slate-600 hover:to-slate-800 
            hover:scale-105 hover:shadow-lg 
            active:scale-95 transition-all duration-300 ease-in-out cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={() => handleOnFollow(selectedUser?._id)}
                  disabled={loadingUserId === selectedUser?._id}
                >
                  {loadingUserId === selectedUser?._id ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                      <span className="text-sm">
                        {isAlreadyFollowing ? "Unfollowing..." : "Following..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isAlreadyFollowing ? (
                        <SlUserUnfollow className="w-5 h-5 text-red-400" />
                      ) : (
                        <SlUserFollow className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Close */}
                <button
                  className="cursor-pointer p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex-shrink-0"
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ---------- For Mobile (< sm) ---------- */}
              <div className="flex sm:hidden items-center gap-2 relative">
                {/* Follow / Unfollow */}

                {/* Close */}
                <button
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex-shrink-0"
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  className="px-2.5 py-2.5 bg-gradient-to-r from-slate-500 to-slate-700 
            text-gray-200 font-semibold rounded-full shadow-md 
            hover:from-slate-600 hover:to-slate-800 
            hover:scale-105 hover:shadow-lg 
            active:scale-95 transition-all duration-300 ease-in-out cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={() => handleOnFollow(selectedUser?._id)}
                  disabled={loadingUserId === selectedUser?._id}
                >
                  {loadingUserId === selectedUser?._id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                  ) : isAlreadyFollowing ? (
                    <SlUserUnfollow className="w-5 h-5 text-red-400" />
                  ) : (
                    <SlUserFollow className="w-5 h-5 text-green-400" />
                  )}
                </button>
                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                    onClick={() => setShowMenu((prev) => !prev)}
                  >
                    <Menu className="w-5 h-5 text-fuchsia-300" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2 flex flex-col z-50">
                      {/* Search */}
                      <button onClick={()=> toast.info("feature coming soon..")} className="flex items-center gap-2 p-2 text-gray-200 hover:bg-gray-700 rounded-md">
                        <Search className="w-5 h-5 text-blue-400" /> Search
                      </button>

                      {/* Visit-user */}
                      <Link
                        to={`/visit-user/${selectedUser?._id}`}
                        className="flex items-center gap-2 p-2 text-gray-200 hover:bg-gray-700 rounded-md"
                      >
                        <GrView className="w-5 h-5 text-cyan-700" /> Visit
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* image preview -> other concept  */}
      {/* Image-View Modal */}
      <AnimatePresence>
        {isImageModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-[200] backdrop-blur-md bg-black bg-opacity-20"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-2xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute -top-12 right-0 text-red-500 hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors z-10"
                onClick={() => setIsImageModalOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Profile Image */}
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={selectedUser.profilePic || "/dfp.png"}
                  alt={selectedUser.username}
                  className="w-full h-full object-cover max-w-2xl max-h-[70vh]"
                />

                {/* Username Caption */}
                <div className="p-4 bg-gray-800 text-center">
                  <h3 className="text-lg font-semibold text-gray-300">
                    {selectedUser.username}
                  </h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHeader;
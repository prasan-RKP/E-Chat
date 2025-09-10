import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Search, XCircle } from "lucide-react";

const FollowersModal = ({
  isOpen,
  onClose,
  users,
  type,
  themeClasses,
  handleFollowView,
}) => {
  // ✅ Hooks always at top
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter((u) => {
      const username =
        typeof u === "object" ? u?.username?.toLowerCase() : u?.toLowerCase();
      return username?.includes(search.toLowerCase());
    });
  }, [search, users]);

  // ✅ Now safe to exit early
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-md ${themeClasses.cardBg} rounded-3xl shadow-2xl border flex flex-col max-h-[80vh]`}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg sm:text-xl font-bold ${themeClasses.text}`}>
                {type === "followers" ? "Followers" : "Following"}
                <span className={`ml-2 text-sm ${themeClasses.textMuted}`}>
                  ({users.length})
                </span>
              </h3>
              <motion.button
                onClick={onClose}
                className={`p-2 rounded-full ${themeClasses.hover} transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className={themeClasses.textSecondary} />
              </motion.button>
            </div>

            {/* Search Input */}
            <div className="mt-3 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${type}...`}
                className={`w-full rounded-full py-2 pl-10 pr-10 text-sm outline-none border ${themeClasses.text} ${themeClasses.cardBg}`}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <XCircle
                    size={18}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div
            className={`flex-1 p-4 ${
              filteredUsers.length > 4 ? "overflow-y-auto" : ""
            }`}
          >
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users
                  className={`w-12 h-12 mx-auto mb-3 ${themeClasses.textMuted}`}
                />
                <p className={themeClasses.textMuted}>No {type} found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user, index) => {
                  const userObj =
                    typeof user === "object" ? user : { _id: user };
                  const isHydrated = !!userObj?.username;

                  return (
                    <motion.div
                      key={userObj._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-2xl ${themeClasses.hover} transition-colors`}
                    >
                      {!isHydrated ? (
                        <div className="animate-pulse flex items-center gap-3 w-full">
                          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28" />
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <img
                            src={userObj?.profilePic || "/dfp.png"}
                            alt={userObj?.username}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold ${themeClasses.text} truncate`}
                            >
                              {userObj?.username}
                            </p>
                            <p
                              className={`text-sm ${themeClasses.textMuted} truncate`}
                            >
                              @{userObj?.username}
                            </p>
                          </div>
                          <motion.button
                            className="hover:cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs sm:text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              handleFollowView(userObj?._id);
                              onClose();
                            }}
                          >
                            View
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FollowersModal;

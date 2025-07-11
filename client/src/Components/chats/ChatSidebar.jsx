import React, { useEffect, useState, useCallback } from "react";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

const ChatSidebar = () => {
  const { getUsers, users, setSelectedUser, setIsSidebarOpen, isSidebarOpen, isUserLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const [filterOnline, setFilterOnline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = filterOnline
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

    console.log("Filtered Users", filteredUsers);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 p-4 shadow-lg transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-300">Chats</h2>
        <div className="flex items-center gap-4">
          <button className="sm:hidden text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-white" onClick={() => setIsModalOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Online Filter Toggle */}
      <div className="flex justify-between items-center">
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

      {/* Users List / Skeleton Loader */}
      <div className="mt-4 space-y-3 relative">
        {isUserLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="w-32 h-4 bg-gray-600 rounded-md"></div>
            </div>
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-all"
                onClick={() => {
                  setSelectedUser(user);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700 shadow-md"
                  />
                  <span className="font-medium text-gray-300">{user.username}</span>
                </div>
                <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}></span>
              </motion.div>
            );
          })
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

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-full px-4 z-50"
            >
              <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700">
                <button 
                  className="absolute top-2 right-7 text-gray-400 hover:text-red" 
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-6 h-6 hover:text-red-400" />
                </button>
                <div className="flex flex-col space-y-4 mt-4">
                  <button 
                    onClick={() => {
                      navigate("/new-group");
                      setIsModalOpen(false);
                    }} 
                    className="text-gray-300 hover:text-blue-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    New Group
                  </button>
                  <button 
                    onClick={() => {
                      navigate("/linked-device");
                      setIsModalOpen(false);
                    }} 
                    className="text-gray-300 hover:text-green-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    Linked Device
                  </button>
                  <button 
                    onClick={() => {
                      navigate("/faved-people");
                      setIsModalOpen(false);
                    }} 
                    className="text-gray-300 hover:text-purple-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    Faved People
                  </button>
                  <button 
                    onClick={() => {
                      navigate("/settings");
                      setIsModalOpen(false);
                    }} 
                    className="text-gray-300 hover:text-yellow-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatSidebar;
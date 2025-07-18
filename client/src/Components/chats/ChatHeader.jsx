import React from "react";
import { X, Menu, Home, User, LogOut, Images } from "lucide-react";
import { useChatStore } from "../../store/useChatStore.js";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

const ChatHeader = () => {
  const { setSelectedUser, selectedUser, setIsSidebarOpen } = useChatStore();
  const { logout } = useAuthStore();

  const navigate = useNavigate();

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
                src={selectedUser.profilePic || "/dfp.png"}
                alt={selectedUser.username}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-700 shadow-md flex-shrink-0"
              />
              <h2 className="text-base sm:text-lg font-bold text-gray-300 truncate min-w-0">{selectedUser.username}</h2>
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

          {selectedUser && (
            <button
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex-shrink-0 sm:"
              onClick={() => setSelectedUser(null)}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
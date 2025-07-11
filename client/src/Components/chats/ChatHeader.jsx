import React from "react";
import { X, Menu, Home, User, LogOut, Images } from "lucide-react";
import { useChatStore } from "../../store/useChatStore.js";
import {useNavigate} from'react-router-dom';
import { useAuthStore } from "../../store/useAuthStore.js";

const ChatHeader = () => {
  const { setSelectedUser, selectedUser, setIsSidebarOpen } = useChatStore();
  const {logout} = useAuthStore();

  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 shadow-md flex justify-between items-center p-4">
      {/* Left Section - Sidebar Toggle & Chat Info */}
      <div className="flex items-center gap-4">
        <button className="sm:hidden text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        {selectedUser ? (
          <div className="flex items-center gap-3">
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.username}
              className="w-12 h-12 rounded-full object-cover border border-gray-700 shadow-md"
            />
            <h2 className="text-lg font-bold text-gray-300">{selectedUser.username}</h2>
          </div>
        ) : null}
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center gap-6">
        {!selectedUser && (
          <>
            <button onClick={()=> navigate("/")}  className="text-gray-300 hover:text-blue-900">
              <Home className="w-6 h-6" />
            </button>
            <button onClick={()=> navigate("/profile")} className="text-gray-300 hover:text-cyan-500">
              <User className="w-6 h-6" />
            </button>
            <button onClick={()=> navigate("/allposts")} className="text-gray-300 hover:text-green-700">
              <Images className="w-6 h-6" />
            </button>
            <button onClick={()=> logout(navigate)} className="text-gray-300 hover:text-red-800">
              <LogOut className="w-6 h-6" />
            </button>
          </>
        )}

        {selectedUser && (
          <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all" onClick={() => setSelectedUser(null)}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

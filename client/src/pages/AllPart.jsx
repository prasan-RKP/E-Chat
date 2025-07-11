import { useState } from "react";
import { Menu, X, Send, MessageSquareText, Camera } from "lucide-react";
import { motion } from "framer-motion";

const usersList = [
  {
    id: 1,
    name: "Alice",
    online: true,
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Bob",
    online: false,
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Charlie",
    online: true,
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "David",
    online: false,
    profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

function ChatSidebar({ setSelectedUser, filterOnline, setFilterOnline, isSidebarOpen, setIsSidebarOpen }) {
  const filteredUsers = filterOnline ? usersList.filter((user) => user.online) : usersList;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 p-4 shadow-lg transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-300">Chats</h2>
        <button className="sm:hidden text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>
      <div
        className={`relative w-12 h-6 rounded-full cursor-pointer flex items-center transition-all duration-300 ${
          filterOnline ? "bg-blue-500" : "bg-gray-600"
        }`}
        onClick={() => setFilterOnline(!filterOnline)}
      >
        <div
          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
            filterOnline ? "translate-x-6" : "translate-x-1"
          }`}
        ></div>
      </div>
      <div className="mt-4 space-y-2">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
            onClick={() => {
              setSelectedUser(user);
              setIsSidebarOpen(false);
            }}
          >
            <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full" />
            <span className="font-medium text-gray-300">{user.name}</span>
            {user.online && <span className="text-green-500 text-sm">●</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChatHeader({ selectedUser, setSelectedUser, setIsSidebarOpen }) {
  return (
    <div className="bg-gray-800 shadow-md flex justify-between items-center p-4">
      <div className="flex items-center gap-3">
        <button className="sm:hidden text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        {selectedUser ? (
          <>
            <img src={selectedUser.profileImage} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
            <h2 className="text-lg font-bold text-gray-300">{selectedUser.name}</h2>
          </>
        ) : (
          <h2 className="text-lg font-bold text-gray-300">Select a Chat</h2>
        )}
      </div>
      {selectedUser && (
        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setSelectedUser(null)}>
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function ChatContainer({ selectedUser }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-900 flex justify-center items-center">
      {!selectedUser ? (
        <motion.div className="flex flex-col items-center text-gray-400" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <MessageSquareText className="w-18 h-18" />
          <p className="mt-2">Select a user to start chatting</p>
        </motion.div>
      ) : (
        <div>
          <div className="mb-2 p-2 bg-gray-800 rounded shadow text-gray-300">Hello!</div>
          <div className="mb-2 p-2 self-end bg-blue-500 text-white rounded shadow">Hi there!</div>
        </div>
      )}
    </div>
  );
}

function ChatMessageInput({ message, setMessage }) {
  return (
    <div className="bg-gray-800 p-4 flex gap-2 shadow-lg">
      <input
        className="flex-1 px-3 py-2 border rounded bg-gray-700 text-gray-300 focus:outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        <Camera className="w-5 h-5" />
      </button>
      <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function ChatComponent() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterOnline, setFilterOnline] = useState(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <ChatSidebar {...{ setSelectedUser, filterOnline, setFilterOnline, isSidebarOpen, setIsSidebarOpen }} />
      <div className="flex-1 flex flex-col">
        <ChatHeader {...{ selectedUser, setSelectedUser, setIsSidebarOpen }} />
        <ChatContainer selectedUser={selectedUser} />
        {selectedUser && <ChatMessageInput {...{ message, setMessage }} />}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  User,
  MessageCircle,
  LogOut,
  Image,
  X,
  ReceiptText,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const {logout} = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <Menu
            className="w-6 h-6 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <h1 className="text-xl font-bold">My Website</h1>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
          />
          <Search className="w-6 h-6 text-gray-400" />
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 p-6 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Navigation</h2>
          <X
            className="w-6 h-6 cursor-pointer hover:text-red-500"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <ul className="space-y-4">
          <Link to={"/profile"}>
            <li className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 hover:text-blue-400 cursor-pointer">
              <User className="w-6 h-6" />
              <span>Profile</span>
            </li>
          </Link>

          <Link to={"/chat"}>
            <li className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 hover:text-green-400 cursor-pointer">
              <MessageCircle className="w-6 h-6" />
              <span>Chat</span>
            </li>
          </Link>

          <Link to={"/allposts"}>
            <li className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 hover:text-purple-400 cursor-pointer">
              <Image className="w-6 h-6" />
              <span>Posts</span>
            </li>
          </Link>

          <Link to={"/logout"}>
            <li onClick={()=> logout(navigate)} className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 hover:text-red-400 cursor-pointer text-red-400">
              <LogOut className="w-6 h-6" />
              <span>Logout</span>
            </li>
          </Link>

          <Link to={"/adj"}>
            <li className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 hover:text-red-400 cursor-pointer text-red-400">
            <ReceiptText className='w-6 h-6' />
              <span>Formal</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* Hero Section */}
      <header className="py-20 text-center">
        <h1 className="text-4xl font-bold">Welcome to Our Platform</h1>
        <p className="text-lg opacity-90">Your gateway to new opportunities</p>
        <div className="mt-6">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-lg shadow-md">
            Get Started
          </button>
          <button className="ml-4 px-6 py-3 border border-white rounded-md text-lg shadow-md hover:bg-white hover:text-black">
            Learn More
          </button>
        </div>
      </header>

      {/* Features Section */}
      <main className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Explore Features", color: "bg-blue-600" },
          { title: "Join Community", color: "bg-green-600" },
          { title: "Track Progress", color: "bg-purple-600" },
          { title: "Stay Updated", color: "bg-red-600" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md ${item.color} hover:scale-105 transition-transform`}
          >
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-200">
              Enhance your experience with our tools.
            </p>
          </div>
        ))}
      </main>

      {/* Login & Signup */}
      <div className="flex justify-center space-x-4 py-8">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-md"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-md"
        >
          Sign Up
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center bg-gray-800 text-gray-400">
        <p>&copy; 2025 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

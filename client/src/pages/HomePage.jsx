import React, { useState, useEffect } from "react";
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
  Send,
  Users,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Globe,
  Smartphone,
  Palette,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Connect instantly with friends and communities worldwide",
      color: "from-blue-500 to-purple-600",
      hoverColor: "group-hover:from-blue-600 group-hover:to-purple-700",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Groups",
      description: "Join vibrant communities and discover new connections",
      color: "from-green-500 to-teal-600",
      hoverColor: "group-hover:from-green-600 group-hover:to-teal-700",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast messaging with zero delays",
      color: "from-yellow-500 to-orange-600",
      hoverColor: "group-hover:from-yellow-600 group-hover:to-orange-700",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your conversations are protected with end-to-end encryption",
      color: "from-red-500 to-pink-600",
      hoverColor: "group-hover:from-red-600 group-hover:to-pink-700",
    },
  ];

  const stats = [
    { number: "10M+", label: "Active Users" },
    { number: "50M+", label: "Messages Daily" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Menu
                className="w-6 h-6 cursor-pointer hover:text-purple-400 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ChatApp
                </h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                                   placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-2 top-2 w-5 h-5 text-gray-400" />
              </div>
              <Link to="/profile" className="flex items-center space-x-2 hover:text-purple-400">
                <User className="w-6 h-6" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => logout(navigate)}
                className="flex items-center space-x-2 hover:text-red-400"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
<div
  className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    bg-gradient-to-br from-gray-900/80 via-purple-900/70 to-blue-900/80
    backdrop-blur-lg shadow-2xl border-r border-purple-700/30`}
  style={{
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    borderRight: "1.5px solid rgba(128, 90, 213, 0.25)",
  }}
>
  <div className="flex justify-between items-center p-4 border-b border-gray-700/30">
    <h2 className="text-lg font-bold text-purple-200 tracking-wide">Navigation</h2>
    <X
      className="w-6 h-6 cursor-pointer hover:text-red-400 transition"
      onClick={() => setIsSidebarOpen(false)}
    />
  </div>
  <ul className="space-y-2 p-4">
    <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>
      <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-800/30 hover:text-blue-300 transition cursor-pointer">
        <User className="w-6 h-6" />
        <span>Profile</span>
      </li>
    </Link>
    <Link to="/chat" onClick={() => setIsSidebarOpen(false)}>
      <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-800/30 hover:text-green-300 transition cursor-pointer">
        <MessageCircle className="w-6 h-6" />
        <span>Chat</span>
      </li>
    </Link>
    <Link to="/allposts" onClick={() => setIsSidebarOpen(false)}>
      <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700/30 hover:text-purple-300 transition cursor-pointer">
        <Image className="w-6 h-6" />
        <span>Posts</span>
      </li>
    </Link>
    <li
      onClick={() => {
        logout(navigate);
        setIsSidebarOpen(false);
      }}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-800/30 hover:text-red-300 transition cursor-pointer text-red-400"
    >
      <LogOut className="w-6 h-6" />
      <span>Logout</span>
    </li>
    <Link to="/adj" onClick={() => setIsSidebarOpen(false)}>
      <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-800/30 hover:text-yellow-300 transition cursor-pointer">
        <ReceiptText className="w-6 h-6" />
        <span>Formal</span>
      </li>
    </Link>
  </ul>
</div>

      {/* Main Content */}
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to ChatApp
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            The next generation real-time chat platform for everyone.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-lg shadow-md transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-white rounded-md text-lg shadow-md hover:bg-white hover:text-black transition"
            >
              Login
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group p-6 rounded-xl shadow-lg bg-gradient-to-br ${feature.color} hover:scale-105 transition-transform ${feature.hoverColor}`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
              <p className="text-gray-100">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section className="flex flex-wrap justify-center gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-gray-800 rounded-lg px-8 py-6 shadow-md"
            >
              <span className="text-3xl font-extrabold text-purple-400">{stat.number}</span>
              <span className="text-gray-300">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to start chatting?</h2>
          <Link
            to="/chat"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold shadow-lg transition"
          >
            <Send className="w-5 h-5 mr-2" />
            Go to Chat
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center bg-gray-900 text-gray-400">
        <p>&copy; 2025 ChatApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
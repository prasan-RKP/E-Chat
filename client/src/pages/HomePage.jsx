import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  Download,
  Heart,
  Lock,
  Cpu,
  Cloud,
  Mic,
  Video,
  FileText,
  Share2,
  Award,
  TrendingUp,
  Layers,
  Infinity,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Users2,
  ChevronDown,
  MousePointer2,
  Waves,
  Github,
  Linkedin
} from "lucide-react";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Mock auth store for demo
  const logout = (navigate) => {
    console.log("Logout called");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 4);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Instant Messaging",
      description: "Lightning-fast real-time conversations with advanced message features",
      color: "from-violet-500 via-purple-500 to-indigo-600",
      hoverColor: "hover:shadow-violet-500/30",
      detail: "Send text, voice notes, and media instantly with read receipts and typing indicators",
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: "Smart Communities",
      description: "AI-powered community suggestions and intelligent group management",
      color: "from-emerald-500 via-teal-500 to-cyan-600",
      hoverColor: "hover:shadow-emerald-500/30",
      detail: "Join communities based on your interests with smart moderation and engagement analytics",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Military-Grade Security",
      description: "End-to-end encryption with quantum-resistant security protocols",
      color: "from-rose-500 via-pink-500 to-red-600",
      hoverColor: "hover:shadow-rose-500/30",
      detail: "Your privacy is guaranteed with advanced encryption and zero-knowledge architecture",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Experience",
      description: "Smart suggestions, auto-translate, and intelligent conversation insights",
      color: "from-amber-500 via-orange-500 to-yellow-600",
      hoverColor: "hover:shadow-amber-500/30",
      detail: "Experience the future of messaging with AI assistance and predictive features",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      avatar: "SC",
      content: "ChatApp has revolutionized how our team collaborates. The AI features are incredible!",
      rating: 5,
      company: "@Meta"
    },
    {
      name: "Marcus Johnson",
      role: "Startup Founder",
      avatar: "MJ",
      content: "The security features give me complete peace of mind for sensitive business discussions.",
      rating: 5,
      company: "@TechCorp"
    },
    {
      name: "Elena Rodriguez",
      role: "Community Manager",
      avatar: "ER",
      content: "Managing communities has never been easier. The smart moderation is a game-changer.",
      rating: 5,
      company: "@SocialNet"
    },
  ];

  const floatingElements = [
    { icon: <MessageCircle className="w-6 h-6" />, delay: 0 },
    { icon: <Heart className="w-5 h-5" />, delay: 1 },
    { icon: <Star className="w-4 h-4" />, delay: 2 },
    { icon: <Sparkles className="w-5 h-5" />, delay: 3 },
    { icon: <Zap className="w-4 h-4" />, delay: 4 },
    { icon: <Users className="w-5 h-5" />, delay: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden relative">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic mouse-following gradient */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        />

        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating particles */}
        {floatingElements.map((element, idx) => (
          <div
            key={idx}
            className={`absolute animate-float text-purple-400/40`}
            style={{
              left: `${10 + idx * 15}%`,
              top: `${20 + idx * 10}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${6 + idx}s`
            }}
          >
            {element.icon}
          </div>
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Glassmorphism Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
          ? "bg-slate-950/80 backdrop-blur-2xl shadow-2xl border-b border-purple-500/20"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="group p-3 rounded-2xl hover:bg-purple-500/10 transition-all duration-300 hover:scale-110"
              >
                <Menu className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    ChatApp
                  </h1>
                  <p className="text-xs text-gray-400 -mt-1 font-medium">Next-Gen Platform</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-12 pr-6 py-3 w-80 rounded-2xl bg-slate-800/30 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-slate-700/30 transition-all duration-300 hover:bg-slate-800/50 focus:bg-slate-800/60"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <Link
                to="/profile"
                className="group flex items-center space-x-2 px-4 py-3 rounded-2xl hover:bg-slate-800/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <User className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                <span className="font-semibold">Profile</span>
              </Link>

              <button
                onClick={() => logout(navigate)}
                className="group flex items-center space-x-2 px-4 py-3 rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Sidebar with Glassmorphism */}
      <div
        className={`fixed top-0 left-0 h-full w-80 z-40 transition-all duration-500 ease-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-slate-950/90 backdrop-blur-2xl shadow-2xl border-r border-purple-500/20`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-slate-700/30">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Navigation
              </h2>
              <p className="text-sm text-gray-400">Explore ChatApp</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="group p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-2">
            {[
              { icon: User, label: "Profile", path: "/profile", color: "hover:bg-purple-500/10", gradient: "from-purple-400 to-pink-400" },
              { icon: MessageCircle, label: "Chat", path: "/chat", color: "hover:bg-blue-500/10", gradient: "from-blue-400 to-cyan-400" },
              { icon: Image, label: "Posts", path: "/allposts", color: "hover:bg-emerald-500/10", gradient: "from-emerald-400 to-teal-400" },
              { icon: ReceiptText, label: "Formal", path: "/adj", color: "hover:bg-amber-500/10", gradient: "from-amber-400 to-orange-400" },
            ].map((item, index) => (
              <Link key={index} to={item.path} onClick={toggleSidebar}>
                <div className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${item.color} hover:scale-105 border border-transparent hover:border-slate-700/50`}>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 group-hover:scale-110`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold group-hover:text-white transition-colors">{item.label}</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}

            <button
              onClick={() => {
                logout(navigate);
                toggleSidebar();
              }}
              className="w-full group flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all duration-300 cursor-pointer hover:scale-105 border border-transparent hover:border-red-500/20"
            >
              <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-semibold text-red-400 group-hover:text-red-300">Logout</span>
            </button>
          </div>

          <div className="p-6 border-t border-slate-700/30 text-center bg-gradient-to-t from-slate-900/50">
            <p className="text-xs text-gray-500">ChatApp v2.0</p>
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-400 animate-pulse" />
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-500"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="pt-24 relative z-10">
        {/* Hero Section with 3D Effects */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8 animate-fadeInUp">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                    Connect
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 blur-2xl opacity-20 animate-pulse"></div>
                </span>
                <br />
                <span className="text-white hover:text-gray-300 transition-colors duration-300">Beyond Words</span>
              </h1>
            </div>

            <div className="mb-12 animate-fadeInUp animation-delay-200">
              <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience the future of communication with{" "}
                <span className="text-purple-400 font-semibold">AI-powered messaging</span>,
                quantum-secure encryption, and seamless global connectivity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fadeInUp animation-delay-400">
              <Link
                to="/signup"
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-purple-500/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>

              <Link
                to="/login"
                className="group relative px-12 py-6 border-2 border-slate-600 hover:border-purple-500 rounded-2xl text-xl font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Play className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
                  Watch Demo
                </div>
              </Link>
            </div>

            {/* 3D Hero Mockup */}
            <div className="relative mx-auto w-full max-w-5xl animate-fadeInUp animation-delay-600">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/30 shadow-2xl group-hover:scale-105 transition-all duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                      <div className="w-4 h-4 bg-green-500 rounded-full hover:scale-125 transition-transform cursor-pointer"></div>
                    </div>
                    <div className="text-sm text-gray-400 font-mono">ChatApp • Live Preview</div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { name: "Alice", color: "from-purple-500 to-pink-500", message: "Hey! Check out this new AI feature 🤖", time: "2m ago" },
                      { name: "Bob", color: "from-blue-500 to-cyan-500", message: "Amazing! The translations are perfect ✨", time: "1m ago" },
                      { name: "You", color: "from-emerald-500 to-teal-500", message: "Love the security features! 🛡️", time: "now", typing: true }
                    ].map((chat, i) => (
                      <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300 ${chat.name === 'You' ? 'ml-8' : 'mr-8'}`}>
                        <div className={`w-12 h-12 bg-gradient-to-br ${chat.color} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300`}>
                          {chat.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{chat.name}</span>
                            <span className="text-xs text-gray-400">{chat.time}</span>
                          </div>
                          <div className="bg-slate-700/50 rounded-2xl px-4 py-2 hover:bg-slate-700/70 transition-colors">
                            <p className="text-gray-100">{chat.message}</p>
                            {chat.typing && (
                              <div className="flex gap-1 mt-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Features Grid with Hover Animations */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover why millions choose ChatApp for their communication needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group relative p-8 rounded-3xl transition-all duration-700 cursor-pointer hover:scale-105 ${feature.hoverColor} hover:shadow-2xl overflow-hidden`}
                style={{
                  background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[2].replace('to-', '')})`
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg text-white/90 mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                  <p className="text-sm text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
                    {feature.detail}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium group-hover:text-white transition-all duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Enhanced Cards */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              What Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {testimonial.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-purple-300 transition-colors">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-purple-400 text-xs font-medium">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* // ...existing code... */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-white/90 mb-4 group-hover:text-white transition-colors duration-300">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Ready to experience the future of chat?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of users who trust ChatApp for secure, smart, and seamless communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg font-bold shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-purple-500/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <Download className="w-6 h-6" />
                Get Started Free
              </div>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
            <Link
              to="/login"
              className="group relative px-10 py-5 border-2 border-slate-600 hover:border-purple-500 rounded-2xl text-lg font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <Play className="w-6 h-6" />
                Watch Demo
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-purple-500/20 mt-24">
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              ChatApp
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Connect, share, and discover amazing content with our vibrant community. Your story matters, and we're here to help you tell it.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/30 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-700/30 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-pink-500/30 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/profile" className="hover:text-purple-400 transition-colors duration-300">Go to Profile</Link></li>
              <li><Link to="/chat" className="hover:text-purple-400 transition-colors duration-300">Start Chat</Link></li>
              <li><Link to="/allposts" className="hover:text-purple-400 transition-colors duration-300">See Posts</Link></li>
              <li><Link to="/signup" className="hover:text-purple-400 transition-colors duration-300">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>support@chatapp.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Worldwide</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ChatApp. All rights reserved. Built with ❤️ for the community.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
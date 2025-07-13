import { Home, LogOut, UserCircle, ImageIcon, Sparkles, Heart, MessageCircle, Share2, Grid3X3, Plus, Search, Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { usePostStore } from "../store/usePostStore.js";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
import { useInView } from "react-intersection-observer";

import "../stylesheets/myCustom.css";
import PostCarousel from "../assets/PostCarousel.jsx";

const OldPost = () => {
  const { authUser, logout } = useAuthStore();
  const { showPost, fetchingPosts } = usePostStore();
  const [user, setUser] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  
  const naviagte = useNavigate();
  const scrollContainerRef = useRef(null);
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    showPost();
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log("The authUser value is", user);

  const handlePostClick = (index) => {
    setActiveIndex(index);
    setShowCarousel(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const glowVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 0.6, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const filteredPosts = user?.posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const EmptyState = () => (
    <motion.div
      ref={heroRef}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="mx-auto mb-8 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 flex items-center justify-center relative overflow-hidden"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <ImageIcon className="w-16 h-16 text-purple-400 relative z-10" />
              <Sparkles className="absolute top-2 right-2 w-6 h-6 text-pink-400 animate-pulse" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your Canvas Awaits
            </motion.h2>
            
            <motion.p
              className="text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Every masterpiece starts with a single stroke. Share your first moment and watch your story unfold.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Create First Post
              </motion.button>
              
              <motion.button
                className="px-8 py-3 border border-slate-600 rounded-full font-semibold text-slate-300 hover:bg-slate-800 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, borderColor: "#8b5cf6" }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
                Explore
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f172a] text-white">
      {/* Enhanced Navbar */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MyApp
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <motion.div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>

              <div className="flex items-center gap-2">
                <Link to="/">
                  <motion.button
                    className="p-2 rounded-full hover:bg-slate-800 transition-all duration-200 relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Home className="w-5 h-5" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                      Home
                    </span>
                  </motion.button>
                </Link>

                <motion.button
                  className="p-2 rounded-full hover:bg-slate-800 transition-all duration-200 relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                    Notifications
                  </span>
                </motion.button>

                <Link to="/profile">
                  <motion.button
                    className="p-2 rounded-full hover:bg-slate-800 transition-all duration-200 relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                      Profile
                    </span>
                  </motion.button>
                </Link>

                <motion.button
                  onClick={() => logout(naviagte)}
                  className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                    Logout
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link to="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all duration-200">
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all duration-200">
                    <UserCircle className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => logout(naviagte)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* View Mode Toggle */}
        {user?.posts?.length > 0 && (
          <motion.div
            className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Posts
              </h2>
              <span className="text-sm text-slate-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-full">
              <motion.button
                className={`p-2 rounded-full transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid3X3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                className={`p-2 rounded-full transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setViewMode('list')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {fetchingPosts ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <PostSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : filteredPosts.length > 0 ? (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                ref={scrollContainerRef}
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    className={`group cursor-pointer ${
                      viewMode === 'list' ? 'flex gap-4' : ''
                    }`}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    onClick={() => handlePostClick(index)}
                    onMouseEnter={() => setHoveredPost(index)}
                    onMouseLeave={() => setHoveredPost(null)}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'}`}>
                        <motion.img
                          src={post.postImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                        
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                        >
                          <div className="flex items-center gap-4 text-white">
                            <motion.button
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <MessageCircle className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Share2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-purple-400 transition-colors duration-200">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2 group-hover:text-slate-300 transition-colors duration-200">
                          {post.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* Carousel */}
      <AnimatePresence>
        {showCarousel && (
          <PostCarousel
            posts={user.posts}
            onClose={() => setShowCarousel(false)}
            initialIndex={activeIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OldPost;
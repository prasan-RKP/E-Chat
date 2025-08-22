import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { MoreHorizontal, MapPin, ExternalLink, Grid3X3, Heart, MessageCircle, Share, Home, Search, Plus, User, Menu, X, Star, Zap, Award, Sun, Moon, Bell, Settings } from 'lucide-react';

const VisitUser = () => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const profileRef = useRef(null);
    const statsRef = useRef(null);
    const postsRef = useRef(null);

    useEffect(() => {
        // GSAP entrance animations
        const tl = gsap.timeline();

        tl.from(profileRef.current, {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: "power3.out"
        })
            .from(statsRef.current?.children, {
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.8")
            .from(postsRef.current?.children, {
                duration: 0.6,
                scale: 0.8,
                opacity: 0,
                stagger: 0.05,
                ease: "power2.out"
            }, "-=0.4");

        setIsLoaded(true);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const stats = [
        { label: 'Posts', value: '25', icon: Grid3X3, color: 'from-blue-500 to-cyan-500' },
        { label: 'Followers', value: '1.2k', icon: Heart, color: 'from-pink-500 to-rose-500' },
        { label: 'Following', value: '320', icon: Star, color: 'from-purple-500 to-indigo-500' }
    ];

    const tabs = ['Posts', 'Liked', 'Tagged'];

    const posts = Array(9).fill(null).map((_, i) => ({
        id: i,
        image: `https://picsum.photos/400/400?random=${i + 1}`,
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 50) + 5,
        isVideo: i % 3 === 0
    }));

    const navItems = [
        { label: 'Home', icon: Home },
        { label: 'Explore', icon: Search },
        { label: 'Messages', icon: MessageCircle },
        { label: 'Profile', icon: User }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const themeClasses = {
        background: isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
        cardBg: isDarkMode
            ? "backdrop-blur-xl bg-slate-800/90 border-slate-700/50"
            : "backdrop-blur-xl bg-white/80 border-white/20",
        text: isDarkMode ? "text-gray-100" : "text-gray-900",
        textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
        textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
        hover: isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-white/50"
    };

    return (
        <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden transition-all duration-500`}>
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className={`absolute -top-40 -right-40 w-96 h-96 ${isDarkMode ? 'bg-gradient-to-br from-blue-600/10 to-purple-800/10' : 'bg-gradient-to-br from-blue-400/20 to-purple-600/20'} rounded-full blur-3xl`}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className={`absolute -bottom-40 -left-40 w-96 h-96 ${isDarkMode ? 'bg-gradient-to-br from-pink-600/10 to-orange-800/10' : 'bg-gradient-to-br from-pink-400/20 to-orange-600/20'} rounded-full blur-3xl`}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 ${isDarkMode ? 'bg-gradient-to-br from-indigo-600/5 to-cyan-800/5' : 'bg-gradient-to-br from-indigo-400/10 to-cyan-600/10'} rounded-full blur-3xl`}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Enhanced Header with Glassmorphism */}
            <header className={`backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-white/20'} shadow-2xl border-b sticky top-0 z-50 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Enhanced Logo */}
                        <motion.div
                            className="flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                <span className="inline-flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Zap className="text-blue-600" size={32} />
                                    </motion.div>
                                    SocialVibe
                                </span>
                            </h1>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-2">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href="#"
                                    className={`relative px-4 py-2 text-sm font-medium ${themeClasses.textSecondary} hover:text-white rounded-2xl transition-all duration-300 group flex items-center gap-2`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <item.icon size={18} />
                                    <span className="relative z-10">{item.label}</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        layoutId={`navbar-bg-${index}`}
                                    />
                                </motion.a>
                            ))}
                        </nav>

                        {/* Theme Toggle & Actions */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={toggleTheme}
                                className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700/50 text-yellow-400' : 'bg-white/20 text-gray-700'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-600/50' : 'border-white/20'} hover:scale-110 transition-all duration-300`}
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isDarkMode ? (
                                        <motion.div
                                            key="sun"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Sun size={20} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="moon"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Moon size={20} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Additional Action Buttons - Hidden on mobile */}
                            <div className="hidden md:flex items-center gap-2">
                                <motion.button
                                    className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700/50 text-gray-300 border-slate-600/50' : 'bg-white/20 text-gray-700 border-white/20'} backdrop-blur-sm border hover:scale-110 transition-all duration-300`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Bell size={20} />
                                </motion.button>
                                <motion.button
                                    className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700/50 text-gray-300 border-slate-600/50' : 'bg-white/20 text-gray-700 border-white/20'} backdrop-blur-sm border hover:scale-110 transition-all duration-300`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Settings size={20} />
                                </motion.button>
                            </div>

                            {/* Mobile menu button */}
                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`lg:hidden p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700/50 text-gray-300 border-slate-600/50' : 'bg-white/20 text-gray-700 border-white/20'} backdrop-blur-sm border`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X size={24} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu size={24} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`lg:hidden py-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-white/20'}`}
                            >
                                {navItems.map((item, index) => (
                                    <motion.a
                                        key={item.label}
                                        href="#"
                                        className={`block px-4 py-3 ${themeClasses.textSecondary} ${themeClasses.hover} rounded-2xl transition-all duration-200 backdrop-blur-sm flex items-center gap-3`}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </motion.a>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
                    {/* Profile Card with Enhanced Glassmorphism */}
                    <div
                        ref={profileRef}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`${themeClasses.cardBg} rounded-3xl shadow-2xl border overflow-hidden mb-8 relative transition-all duration-300`}
                    >
                        {/* Enhanced Gradient Overlay */}
                        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10' : 'bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5'} pointer-events-none`}></div>

                        {/* Profile Header */}
                        <div className="p-6 sm:p-8 lg:p-10 relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                                {/* Enhanced Profile Image */}
                                <motion.div
                                    className="flex-shrink-0 relative mx-auto lg:mx-0"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    />
                                    <img
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%2022%2C%202025%2C%2011_03_11%20AM-y7RBx9kAiiZ4mCIGbb1Br9yUAOTzyg.png"
                                        alt="Profile"
                                        className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </motion.div>
                                </motion.div>

                                {/* Profile Info */}
                                <div className="flex-1 min-w-0 text-center lg:text-left">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                                        <motion.div variants={itemVariants}>
                                            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-gray-100 via-blue-200 to-purple-200' : 'from-gray-900 via-blue-800 to-purple-800'} bg-clip-text text-transparent mb-2`}>
                                                cristiano
                                            </h2>
                                            <p className={`${themeClasses.textSecondary} text-lg lg:text-xl flex items-center justify-center lg:justify-start gap-2`}>
                                                @cristiano
                                                <Award className="text-blue-500" size={18} />
                                            </p>
                                        </motion.div>
                                        <motion.button
                                            className={`mt-4 lg:mt-0 p-3 ${themeClasses.hover} rounded-2xl transition-all duration-300 backdrop-blur-sm`}
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {/* <MoreHorizontal size={24} className={themeClasses.textSecondary} /> */}
                                        </motion.button>
                                    </div>

                                    {/* Enhanced Stats */}
                                    <div ref={statsRef} className="grid grid-cols-3 gap-4 lg:gap-8 mb-8">
                                        {stats.map((stat, index) => (
                                            <motion.div
                                                key={stat.label}
                                                className={`text-center p-4 lg:p-6 rounded-2xl ${isDarkMode
                                                    ? 'bg-slate-700/30 hover:bg-slate-600/50'
                                                    : 'bg-white/50 hover:bg-white/70'
                                                    } backdrop-blur-sm border ${isDarkMode ? 'border-slate-600/30' : 'border-white/20'
                                                    } transition-all duration-300 group cursor-pointer`}
                                                whileHover={{ scale: 1.05, y: -8 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className={`w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                    <stat.icon size={20} className="text-white" />
                                                </div>
                                                <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-gray-100 to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent`}>
                                                    {stat.value}
                                                </div>
                                                <div className={`text-sm lg:text-base ${themeClasses.textMuted} font-medium`}>{stat.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Bio */}
                            <motion.div className="space-y-6 text-center lg:text-left" variants={itemVariants}>
                                <h3 className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-gray-100 to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent`}>
                                    Cristiano Ronaldo
                                </h3>
                                <p className={`${themeClasses.text} text-lg lg:text-xl leading-relaxed font-medium`}>
                                    Footballer ⚽ | Fitness 🏋️ | Father 🖤
                                </p>
                                <div className={`flex items-center justify-center lg:justify-start ${themeClasses.textSecondary} mb-3 text-lg`}>
                                    <MapPin size={20} className="mr-3 text-red-500" />
                                    <span>Madrid, Spain</span>
                                </div>
                                <motion.a
                                    href="#"
                                    className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200 font-semibold text-lg"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <ExternalLink size={20} className="mr-3" />
                                    www.cr7.com
                                </motion.a>
                            </motion.div>

                            {/* Enhanced Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                <motion.button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 lg:py-5 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group text-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10">Follow</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        whileHover={{ scale: 1.05 }}
                                    />
                                </motion.button>
                                <motion.button
                                    className={`flex-1 ${isDarkMode ? 'bg-slate-700/70 text-gray-100 border-slate-600/50' : 'bg-white/70 text-gray-900 border-white/20'} backdrop-blur-sm py-4 lg:py-5 px-8 rounded-2xl font-bold border hover:${isDarkMode ? 'bg-slate-600/80' : 'bg-white/90'} transition-all duration-300 shadow-lg text-lg`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Message
                                </motion.button>
                            </div>

                            {/* Enhanced Interest Icons */}
                            <div className="flex justify-center gap-6 lg:gap-8 mt-10">
                                {[
                                    { icon: '⚽', color: 'from-green-400 to-emerald-500', label: 'Football' },
                                    { icon: '🏋️', color: 'from-orange-400 to-red-500', label: 'Fitness' },
                                    { icon: '🖤', color: 'from-gray-400 to-gray-600', label: 'Family' }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className={`w-18 h-18 lg:w-20 lg:h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-3xl cursor-pointer shadow-xl relative overflow-hidden group`}
                                        whileHover={{ scale: 1.15, rotate: 10 }}
                                        whileTap={{ scale: 0.9 }}
                                        title={item.label}
                                    >
                                        <span className="relative z-10 filter drop-shadow-sm">{item.icon}</span>
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Tabs */}
                        <div className={`border-t ${isDarkMode ? 'border-slate-700/50 bg-slate-800/30' : 'border-white/20 bg-white/30'} backdrop-blur-sm`}>
                            <div className="flex relative">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-5 lg:py-6 px-6 text-center font-bold transition-all duration-300 relative text-lg ${activeTab === tab
                                            ? 'text-blue-500'
                                            : `${themeClasses.textSecondary} hover:${themeClasses.text}`
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                layoutId="activeTab"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Posts Grid */}
                        <div className="p-6 lg:p-8">
                            <motion.div
                                ref={postsRef}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {posts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        variants={itemVariants}
                                        className={`relative aspect-square ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200'} rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500`}
                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src={post.image}
                                            alt={`Post ${post.id + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {post.isVideo && (
                                            <motion.div
                                                className="absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1"></div>
                                            </motion.div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        className="flex items-center gap-2"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <Heart size={20} className="fill-current" />
                                                        <span className="text-sm font-semibold">{post.likes}</span>
                                                    </motion.div>
                                                    <motion.div
                                                        className="flex items-center gap-2"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <MessageCircle size={20} />
                                                        <span className="text-sm font-semibold">{post.comments}</span>
                                                    </motion.div>
                                                </div>
                                                <motion.button
                                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
                                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Share size={18} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className={`w-full py-8 mt-12 text-center ${isDarkMode ? 'bg-slate-900/80 border-t border-slate-700/50' : 'bg-white/80 border-t border-white/20'} backdrop-blur-md`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className={`${themeClasses.textMuted} text-sm`}>
                        &copy; {new Date().getFullYear()} SocialVibe. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/30 transition-all duration-300">
                            <Zap className="w-5 h-5" />
                        </a>
                        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-700/30 transition-all duration-300">
                            <User className="w-5 h-5" />
                        </a>
                        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800/50 hover:bg-pink-500/30 transition-all duration-300">
                            <Star className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VisitUser;
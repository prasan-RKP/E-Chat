import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, MapPin, ExternalLink, Grid3X3, Heart, MessageCircle, Share, Home, Search, Plus, User, Menu, X, Star, Zap, Award, Sun, Moon, Bell, Settings, Play, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import VisitUserSkeleton from '../skeletons/VisitUserSkeleton';

// Modal Component for Followers/Following
const FollowersModal = ({ isOpen, onClose, users, title, isDarkMode, onUserClick }) => {
    if (!isOpen) return null;

    const themeClasses = {
        cardBg: isDarkMode
            ? "backdrop-blur-xl bg-slate-800/90 border-slate-700/50"
            : "backdrop-blur-xl bg-white/90 border-white/20",
        text: isDarkMode ? "text-gray-100" : "text-gray-900",
        textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
        hover: isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-white/50"
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={`${themeClasses.cardBg} rounded-2xl shadow-2xl border max-w-md w-full max-h-96 overflow-hidden`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-bold ${themeClasses.text}`}>
                                {title} ({users?.length || 0})
                            </h3>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full ${themeClasses.hover} transition-colors`}
                            >
                                <X size={18} className={themeClasses.textSecondary} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-80">
                        {users && users.length > 0 ? (
                            <div className="p-4 space-y-3">
                                {users.map((user, index) => (
                                    <motion.div
                                        key={user._id || index}
                                        className={`flex items-center gap-3 p-3 rounded-xl ${themeClasses.hover} cursor-pointer transition-all duration-200`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => onUserClick(user)}
                                    >
                                        <img
                                            src={user.profilePic || "/dfp.png"}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-600/30"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold ${themeClasses.text} truncate`}>
                                                {user.username}
                                            </p>
                                            <p className={`text-sm ${themeClasses.textSecondary} truncate`}>
                                                @{user.username}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-white" />
                                </div>
                                <p className={`${themeClasses.text} font-medium mb-2`}>
                                    No {title.toLowerCase()} yet
                                </p>
                                <p className={`${themeClasses.textSecondary} text-sm`}>
                                    {title === 'Followers' 
                                        ? 'No one is following this user currently'
                                        : 'This user is not following anyone currently'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const VisitUser = () => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ users: [], title: '' });
    const profileRef = useRef(null);
    const statsRef = useRef(null);
    const postsRef = useRef(null);

    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loadingId, setLoadingId] = useState('');

    const { visitUser, visitUserValue, authUser, followFeature } = useAuthStore();

    // Checking if user already been following
    const isAlreadyFollowing = userData?.followers?.includes(authUser?._id);

    //All logics will start from here..
    const { id } = useParams();

    useEffect(() => {
        const isLoad = async () => {
            await visitUser({ userId: id });
        }

        isLoad();
    }, []);

    // Storing the user details in a variable
    useEffect(() => {
        if (visitUserValue) {
            setUserData(visitUserValue);
            setPosts(visitUserValue.posts || []);
        }
    }, [visitUserValue])

    // Follow from here 
    const handleFollow = async (id) => {
        setLoadingId(id);

        // optimistic update before API returns
        setUserData((prev) => {
            if (!prev) return prev;
            const already = prev.followers.includes(authUser._id);
            return {
                ...prev,
                followers: already
                    ? prev.followers.filter((f) => f !== authUser._id) // unfollow
                    : [...prev.followers, authUser._id], // follow
            };
        });

        await followFeature({ fid: id }); // sync with backend
        setLoadingId('');
    };

    // Handle modal opening for followers/following
    const handleStatsHover = (statLabel, users) => {
        if (statLabel === 'Followers' || statLabel === 'Following') {
            setModalData({ users: users || [], title: statLabel });
            setModalOpen(true);
        }
    };

    const handleUserClick = (user) => {
        setModalOpen(false);
        // Navigate to user profile - you can implement this based on your routing
        window.location.href = `/visit/${user._id}`;
    };

    // All logic Ends from here
    useEffect(() => {
        // Add a small delay to ensure DOM is fully rendered
        const timer = setTimeout(() => {
            // Import GSAP only if available (for environments that don't have it)
            if (typeof window !== 'undefined' && window.gsap) {
                const tl = window.gsap.timeline();

                // Ensure elements exist before animating
                if (profileRef.current) {
                    tl.from(profileRef.current, {
                        duration: 1.2,
                        y: 50,
                        opacity: 0,
                        ease: "power3.out"
                    });
                }

                // More robust stats animation with fallback
                if (statsRef.current && statsRef.current.children.length > 0) {
                    tl.from(Array.from(statsRef.current.children), {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        stagger: 0.1,
                        ease: "back.out(1.7)"
                    }, "-=0.8");
                }

                // More robust posts animation with fallback
                if (postsRef.current && postsRef.current.children.length > 0) {
                    tl.from(Array.from(postsRef.current.children), {
                        duration: 0.6,
                        scale: 0.8,
                        opacity: 0,
                        stagger: 0.05,
                        ease: "power2.out"
                    }, "-=0.4");
                }
            }

            setIsLoaded(true);
        }, 150); // Increased delay to ensure React has rendered

        return () => clearTimeout(timer);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const stats = [
        { label: 'Posts', value: userData?.posts?.length, icon: Grid3X3, color: 'from-blue-500 to-cyan-500' },
        {
            label: 'Followers', 
            value: userData?.followers?.length,
            icon: Heart, 
            color: 'from-pink-500 to-rose-500',
            users: userData?.followers
        },
        { 
            label: 'Following', 
            value: userData?.following?.length, 
            icon: Star, 
            color: 'from-purple-500 to-indigo-500',
            users: userData?.following
        }
    ];

    const tabs = ['Posts', 'Liked', 'Tagged'];

    const navItems = [
        { label: 'Home', icon: Home, toGo: "/" },
        { label: 'Explore', icon: Search, toGo: "/allposts" },
        { label: 'Messages', icon: MessageCircle, toGo: "/chat" },
        { label: 'Profile', icon: User, toGo: "/profile" }
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

    if (visitUserValue === null) {
        return (
            <><VisitUserSkeleton /></>
        )
    }

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
            <header className={`backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-white/20'} shadow-2xl border-b sticky top-0 z-50 transition-all duration-300 `}>
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
                                    Chat-Io
                                </span>
                            </h1>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {navItems.map((item, index) => (
                                <Link
                                    to={`${item?.toGo}`}
                                    key={index}
                                    className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium ${themeClasses.textSecondary} 
              hover:text-orange-400 transition-colors duration-300`}
                                >
                                    <item.icon
                                        size={18}
                                        className="transition-colors duration-300 group-hover:text-blue-500"
                                    />

                                    {/* Floating label on hover */}
                                    <motion.span
                                        className="relative"
                                        whileHover={{ y: -3 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        {item.label}
                                    </motion.span>

                                    {/* Underline Animation */}
                                    <motion.span
                                        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        whileHover={{ width: "100%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* Theme Toggle & Mobile Menu */}
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
            {/* Header section Ends here  */}

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
                    {/* Profile Card with Enhanced Glassmorphism */}
                    <motion.div
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
                                        src={userData?.profilePic || "/dfp.png"}
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
                                                {userData?.username}
                                            </h2>
                                            <p className={`${themeClasses.textSecondary} text-lg lg:text-xl flex items-center justify-center lg:justify-start gap-2`}>
                                                @{userData?.username}
                                                <Award className="text-blue-500" size={18} />
                                            </p>
                                        </motion.div>
                                        <motion.button
                                            className={`mt-4 lg:mt-0 p-3 ${themeClasses.hover} rounded-2xl transition-all duration-300 backdrop-blur-sm`}
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <MoreHorizontal size={24} className={themeClasses.textSecondary} />
                                        </motion.button>
                                    </div>

                                    {/* Enhanced Stats - Now with guaranteed visibility */}
                                    <motion.div
                                        ref={statsRef}
                                        className="grid grid-cols-3 gap-4 lg:gap-8 mb-8"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            opacity: 1,
                                            visibility: 'visible',
                                            minHeight: '120px' // Ensure minimum height for stats section
                                        }}
                                    >
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
                                                initial={{ opacity: 1, scale: 1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    type: "spring",
                                                    stiffness: 100
                                                }}
                                                onMouseEnter={() => handleStatsHover(stat.label, stat.users)}
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
                                    </motion.div>
                                </div>
                            </div>

                            {/* Enhanced Bio */}
                            <motion.div className="space-y-6 text-center lg:text-left" variants={itemVariants}>
                                <h3 className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-gray-100 to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent`}>
                                    {userData?.username}
                                </h3>
                                <p className={`${themeClasses.text} text-lg lg:text-xl leading-relaxed font-medium`}>
                                    {userData?.passion || "-> Not Mentioned Yet 😐"}
                                </p>
                                <div className={`flex items-center justify-center lg:justify-start ${themeClasses.textSecondary} mb-3 text-lg`}>
                                    <MapPin size={20} className="mr-3 text-red-500" />
                                                                        <span>{userData?.location || "Default"}</span>
                                </div>
                                <motion.a
                                    href={userData?.profileLink || "https://www.default.com"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200 font-semibold text-lg"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <ExternalLink size={20} className="mr-3" />
                                    {userData?.profileLink || "www.default.com"}
                                </motion.a>
                            </motion.div>

                            {/* Follow/Unfollow and Message Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                <motion.button
                                    className="hover:cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 lg:py-5 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group text-lg flex items-center justify-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleFollow(userData?._id)}
                                    disabled={loadingId === userData?._id}
                                >
                                    {loadingId === userData?._id ? (
                                        <div className="flex items-center gap-2">
                                            <span>Loading</span>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>...</span>
                                        </div>
                                    ) : (
                                        <span className="relative z-10">
                                            {userData && authUser
                                                ? isAlreadyFollowing
                                                    ? "UnFollow"
                                                    : "Follow"
                                                : "Loading..."}
                                        </span>
                                    )}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        whileHover={{ scale: 1.05 }}
                                    />
                                </motion.button>

                                <Link
                                    to="/chat"
                                    className={`flex-1 flex items-center justify-center ${isDarkMode ?
                                        "bg-slate-700/70 text-gray-100 border-slate-600/50" :
                                        "bg-gray-300 text-gray-900 border-white/20"} 
                                         backdrop-blur-sm py-4 lg:py-5 px-8 rounded-2xl font-bold border 
                                       hover:${isDarkMode ? "bg-slate-600/80" : "bg-white/90"} 
                                         transition-all duration-300 shadow-lg text-lg`}
                                >
                                    Message
                                </Link>
                            </div>

                            {/* Passions/Interests */}
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

                        {/* Tabs Section */}
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

                        {/* Tab Content */}
                        <div className="p-6 lg:p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === "Posts" && (
                                    <motion.div
                                        key="posts"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
                                    >
                                        {posts.length > 0 ? (
                                            posts.map((post, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={itemVariants}
                                                    className={`relative aspect-square ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200'} rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500`}
                                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <img
                                                        src={post?.postImage}
                                                        alt={`Post ${post?.title}`}
                                                        className="w-full h-full object-cover rounded-2xl"
                                                    />
                                                    {post.isVideo && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                            <Play className="w-10 h-10 text-white opacity-80" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-white/70 dark:bg-slate-800/70 rounded-xl px-3 py-2 shadow-lg transition-all duration-300">
                                                        <div className="flex items-center gap-3">
                                                            <Heart className="w-5 h-5 text-pink-500" />
                                                            <span className="font-semibold text-gray-700 dark:text-gray-200">{post.likes}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <MessageCircle className="w-5 h-5 text-blue-500" />
                                                            {/* Add comments count or other info here */}
                                                        </div>
                                                        <Share className="w-5 h-5 text-gray-500 dark:text-gray-300 cursor-pointer" />
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12">
                                                <div className="text-6xl mb-4">📝</div>
                                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts yet</h3>
                                                <p className="text-gray-500">Start sharing your thoughts!</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === "Liked" && (
                                    <motion.div
                                        key="liked"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center py-12 text-gray-400"
                                    >
                                        <div className="text-6xl mb-4">❤️</div>
                                        <h3 className="text-xl font-semibold mb-2">No liked posts yet</h3>
                                        <p>Like some posts to see them here!</p>
                                    </motion.div>
                                )}

                                {activeTab === "Tagged" && (
                                    <motion.div
                                        key="tagged"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center py-12 text-gray-400"
                                    >
                                        <div className="text-6xl mb-4">🏷️</div>
                                        <h3 className="text-xl font-semibold mb-2">No tagged posts yet</h3>
                                        <p>Get tagged in posts to see them here!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Followers/Following Modal */}
            <FollowersModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                users={modalData.users}
                title={modalData.title}
                isDarkMode={isDarkMode}
                onUserClick={handleUserClick}
            />

            {/* Footer */}
            <footer className={`w-full py-8 mt-12 text-center ${isDarkMode ? 'bg-slate-900/80 border-t border-slate-700/50' : 'bg-white/80 border-t border-white/20'} backdrop-blur-md`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className={`${themeClasses.textMuted} text-sm`}>
                        &copy; {new Date().getFullYear()} Chat-Io. All rights reserved.
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

    )};

    export default VisitUser;
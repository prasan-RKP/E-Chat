import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, MapPin, ExternalLink, Grid3X3, Heart, MessageCircle, Share, Home, Search, Plus, User, Menu, X, Star, Zap, Award, Sun, Moon, Bell, Settings, Play, Loader2, Users, UserPlus, Github, Linkedin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import VisitUserSkeleton from '../skeletons/VisitUserSkeleton';
import { useNavigate } from 'react-router-dom';
import { usePostStore } from '../store/usePostStore';
import { MdHighlight } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';
import FollowersModal from '../Components/openModals/FollowersModal.jsx';
import PostCard from '../skeletons/PostCard.jsx';



const VisitUser = () => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingModalOpen, setFollowingModalOpen] = useState(false);
    const profileRef = useRef(null);
    const statsRef = useRef(null);
    const postsRef = useRef(null);
    const [likingId, setLikingId] = useState('');

    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [tempPosts, setTempPosts] = useState([])
    const [loadingId, setLoadingId] = useState('');
    const [storemyId, setStoreMyId] = useState('');

    const { visitUser, visitUserValue, authUser, followFeature, checkAuth } = useAuthStore();
    const { addLike, showPost, authPost } = usePostStore();

    const isAlreadyFollowing = userData?.followers?.some(follower =>
        typeof follower === 'object' ? follower._id === authUser?._id : follower === authUser?._id
    );

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            await visitUser({ userId: id });
        };
        fetchUserData();
    }, [id, visitUser]);

    useEffect(() => {
        if (visitUserValue) {
            setUserData(visitUserValue);
            // setPosts(visitUserValue.posts || [])
        }
    }, [visitUserValue]);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && window.gsap) {
                const tl = window.gsap.timeline();

                if (profileRef.current) {
                    tl.from(profileRef.current, {
                        duration: 1.2,
                        y: 50,
                        opacity: 0,
                        ease: "power3.out"
                    });
                }

                if (statsRef.current && statsRef.current.children.length > 0) {
                    tl.from(Array.from(statsRef.current.children), {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        stagger: 0.1,
                        ease: "back.out(1.7)"
                    }, "-=0.8");
                }

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
        }, 150);

        return () => clearTimeout(timer);
    }, [userData]);

    //step-1

    useEffect(() => {
        const loadPost = async () => {
            await showPost();
        }
        loadPost();
    }, [showPost])

    // step-2
    useEffect(() => {
        if (authUser?._id) {
            setStoreMyId(authUser?._id);
        }
    }, [authUser]);

    // step-3 Storing posts
    useEffect(() => {
        if (authPost && authPost.length > 0 && id) {
            setTempPosts(authPost);
            const realPost = authPost?.filter((post) => post?.user?._id === id);

            setPosts(realPost || []);
        }
    }, [authPost, id])

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleFollowView = (userId) => {
        navigate(`/visit-user/${userId}`);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // follow feature 
    const handleFollow = async (id) => {
        setLoadingId(id);

        // Optimistic UI update
        setUserData(prev => {
            if (!prev) return prev;

            const isFollowing = prev.followers.some(follower =>
                typeof follower === 'object' ? follower._id === authUser?._id : follower === authUser?._id
            );

            if (isFollowing) {
                return {
                    ...prev,
                    followers: prev.followers.filter(follower =>
                        typeof follower === 'object' ? follower._id !== authUser?._id : follower !== authUser?._id
                    )
                };
            } else {
                return {
                    ...prev,
                    followers: [...prev.followers, authUser?._id]
                };
            }
        });

        await followFeature({ fid: id });
        await checkAuth();
        setLoadingId('');
    };

    // handle 'Add like' added
    const handleAddLike = async (post) => {
        const postId = post?._id;
        const userId = post?.user;

        setLikingId(postId);
        await addLike({ authUserId: userId, postId: postId });
        setLikingId("");
    }

    const stats = [
        { label: 'Posts', value: userData?.posts?.length, icon: Grid3X3, color: 'from-blue-500 to-cyan-500' },
        {
            label: 'Followers',
            value: Array.isArray(userData?.followers) ? userData.followers.length : 0,
            icon: Heart,
            color: 'from-pink-500 to-rose-500',
            onClick: () => setFollowersModalOpen(true)
        },
        {
            label: 'Following',
            value: Array.isArray(userData?.following) ? userData.following.length : 0,
            icon: Star,
            color: 'from-purple-500 to-indigo-500',
            onClick: () => setFollowingModalOpen(true)
        }
    ];

    const tabs = ['Posts', 'Liked', 'Tagged'];

    const navItems = [
        { label: 'Home', icon: Home, toGo: "/" },
        { label: 'Posts', icon: Search, toGo: "/allposts" },
        { label: 'Message', icon: MessageCircle, toGo: "/chat" },
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

    const getFilteredPosts = () => {
        switch (activeTab) {
            case 'Posts':
                return posts;
            case 'Liked':
                return [];
            case 'Tagged':
                return [];
            default:
                return posts;
        }
    };

    const filteredPosts = getFilteredPosts();
    const shouldShowScrollable = filteredPosts.length > 6;

    if (visitUserValue === null) {
        return <VisitUserSkeleton />;
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
                                    {/* <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    > */}
                                    {/* <MdHighlight className="text-blue-600" size={32} /> */}
                                    {/* </motion.div> */}
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

                                    <motion.span
                                        className="relative"
                                        whileHover={{ y: -3 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        {item.label}
                                    </motion.span>

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
                                            <MdHighlight size={20} />
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
                                    <Link
                                        to={`${item?.toGo}`}
                                        key={item.label}
                                        className={`block px-4 py-3 ${themeClasses.textSecondary} ${themeClasses.hover} rounded-2xl transition-all duration-200 backdrop-blur-sm flex items-center gap-3`}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </Link>
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
                                        {/* <motion.button
                                            className={`mt-4 lg:mt-0 p-3 ${themeClasses.hover} rounded-2xl transition-all duration-300 backdrop-blur-sm`}
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <MoreHorizontal size={24} className={themeClasses.textSecondary} />
                                        </motion.button> */}
                                    </div>

                                    {/* Enhanced Stats */}
                                    <motion.div
                                        ref={statsRef}
                                        className="grid grid-cols-3 gap-4 lg:gap-8 mb-8"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            opacity: 1,
                                            visibility: 'visible',
                                            minHeight: '120px'
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
                                                onClick={stat.onClick || (() => { })}
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
                                    {userData?.passion || "-> Not Mentioned Yet 😎"}
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

                            {/* Enhanced Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                <motion.button
                                    className="hover:cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 lg:py-5 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group text-lg flex items-center justify-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleFollow(userData?._id)}
                                    disabled={loadingId === userData?._id || !authUser}
                                >
                                    {loadingId === userData?._id ? (
                                        <div className="flex items-center gap-2">
                                            <span>Loading</span>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>...</span>
                                        </div>
                                    ) : (
                                        <span className="relative z-10">
                                            {authUser && userData
                                                ? isAlreadyFollowing
                                                    ? "UnFollow"
                                                    : "Follow"
                                                : "Login to Follow"}
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
                            {/* All tabs mounted, but hidden with CSS instead of unmounted */}
                            <div className={activeTab === "Posts" ? "block" : "hidden"}>
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
                                            <PostCard
                                                key={index}
                                                post={post}
                                                isDarkMode={isDarkMode}
                                                itemVariants={itemVariants}
                                                likingId={likingId}
                                                handleAddLike={handleAddLike}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-6xl mb-4">📝</div>
                                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts yet</h3>
                                            <p className="text-gray-500">Start sharing your thoughts!</p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            <div className={activeTab === "Liked" ? "block" : "hidden"}>
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
                            </div>

                            <div className={activeTab === "Tagged" ? "block" : "hidden"}>
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
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Followers/Following Modal */}
            <FollowersModal
                isOpen={followersModalOpen}
                onClose={() => setFollowersModalOpen(false)}
                users={userData?.followers || []}
                type="followers"
                isDarkMode={isDarkMode}
                themeClasses={themeClasses}
                handleFollowView={handleFollowView}
            />
            <FollowersModal
                isOpen={followingModalOpen}
                onClose={() => setFollowingModalOpen(false)}
                users={userData?.following || []}
                type="following"
                isDarkMode={isDarkMode}
                themeClasses={themeClasses}
                handleFollowView={handleFollowView}
            />

            {/* Footer */}
            <footer className={`w-full py-8 mt-12 text-center ${isDarkMode ? 'bg-slate-900/80 border-t border-slate-700/50' : 'bg-white/80 border-t border-white/20'} backdrop-blur-md`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className={`${themeClasses.textMuted} text-sm`}>
                        &copy; {new Date().getFullYear()} Chat-Io. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <a href="https://github.com/prasan-RKP" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/30 transition-all duration-300 ${isDarkMode ? 'text-gray-400' : ""}`}>
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://prasan.onrender.com" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-slate-800/50 hover:bg-blue-700/30 transition-all duration-300 ${isDarkMode ? 'text-green-600' : ""}`}>
                            <FaGlobe className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/in/prasan-kumar-05a623345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-slate-800/50 hover:bg-pink-500/30 transition-all duration-300 ${isDarkMode ? 'text-blue-500' : ""}`}>
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VisitUser;
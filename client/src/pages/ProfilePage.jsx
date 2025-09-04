import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  MessageCircle,
  Images,
  LogOut,
  Menu,
  Camera,
  PlusCircle,
  Loader,
  X,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Github,
  Mail,
  Phone,
  Globe,
  ChartPie,
  ChartLine,
  Trash,
  Loader2,
  Map
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { usePostStore } from "../store/usePostStore.js";
import AddFullBio from "./AddFullBio.jsx";
import { toast } from "sonner";


const ProfilePage = () => {
  const { isProfileUploading, authUser, logout, updateProfile, checkAuth } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("Posts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [deleteId, setDeleteId] = useState('');
  const [myPosts, setMyposts] = useState([]);
  const [storeMyId, setStoreMyId] = useState('');
  const [tempPosts, setTempPosts] = useState([]);
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [storeLoadId, setStoreLoadId] = useState("");

  const tabs = ["Posts", "Photos", "Community"];
  //const { deletePost, addLike } = usePostStore();

  const deletePost = usePostStore(state => state.deletePost);
  const addLike = usePostStore(state => state.addLike);
  const showPost = usePostStore(state => state.showPost);
  const authPost = usePostStore(state => state.authPost);

  // Handle imtage selection and convert to base64
  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        updateProfile({ profilePic: reader.result });
      };
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Callling the post section
  useEffect(() => {

    const loadPost = async () => {
      await showPost();
    }
    loadPost();
  }, [showPost]);

  // storing the post Value
  // TODO: from here 

  useEffect(() => {
    if (authPost && authPost.length > 0 && storeMyId) {
      setTempPosts(authPost);
      const realPost = authPost.filter((post) => post?.user?._id === storeMyId);
      setMyposts(realPost || []);
    }
  }, [authPost, storeMyId]);

  //console.log('My Post fter useEffct', tempPosts);


  // useEffect(() => {
  //   fetch("https://dummyjson.com/quotes?limit=30")
  //     .then((res) => res.json())
  //     .then((data) => setCommunityPosts(data.quotes));
  // }, []);

  const navigate = useNavigate();

  //Total Likes
  useEffect(() => {
    if (authUser?._id) {
      setStoreMyId(authUser._id);
    }
  }, [authUser])

  // Handle delete post
  const handleDeletePost = async (postId) => {
    //console.log("getting teh postId", postId)
    setDeleteId(postId);
    await deletePost({ postId });
    setMyposts((posts) => posts.filter((post) => post._id !== postId));
    setDeleteId('');
  };

  console.log("Total posts", authUser);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const socialLinks = [
    { icon: FaLinkedin, color: "text-blue-600", href: "https://www.linkedin.com/in/prasan-kumar-05a623345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    { icon: Github, color: "text-gray-300", href: "https://github.com/prasan-RKP" },
    { icon: Mail, color: "text-red-400", href: "#" },
    { icon: FaGlobe, color: "text-green-400", href: "https://prasan.onrender.com" }
  ];





  // All detaisl for "Add Full Bio" modal
  const [isFullBioModalOpen, setIsFullBioModalOpen] = useState(false);

  const handleOpenBioModal = () => {
    setIsFullBioModalOpen(true);
  };

  const handleCloseBioModal = () => {
    setIsFullBioModalOpen(false);
  };

  // 'khudKo Like karo '

  const handleOwnLike = async (post) => {
    let postId = post?._id;
    let userId = post?.user?._id;

    setStoreLoadId(post?._id);
    await addLike({ authUserId: userId, postId: postId })
    setStoreLoadId("");
    // console.log('Getting userId', post?.user, 'Getting PostId', post?._id);
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#232136] to-[#0f172a] text-white">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Chat-iO
          </motion.span>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 items-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 text-gray-300 hover:text-white"
              >
                <HomeIcon size={24} />
              </motion.button>
            </Link>
            <Link to="/chat">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 text-gray-300 hover:text-white"
              >
                <MessageCircle size={24} />
              </motion.button>
            </Link>
            <Link to="/allposts">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 text-gray-300 hover:text-white"
              >
                <Images size={24} />
              </motion.button>
            </Link>
            <Link to="/pref-chart">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 text-gray-300 hover:text-white"
              >
                <ChartLine size={24} />
              </motion.button>
            </Link>
            <motion.button
              onClick={() => logout(navigate)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 border-t border-gray-800 pt-4"
            >
              <div className="flex flex-col space-y-4">
                <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                  <HomeIcon size={20} />
                  <span>Home</span>
                </Link>
                <Link to="/chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                  <MessageCircle size={20} />
                  <span>Chat</span>
                </Link>
                <Link to="/allposts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                  <Images size={20} />
                  <span>Posts</span>
                </Link>
                <Link to="/pref-chart" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                  <ChartLine size={20} />
                  <span>Performance</span>
                </Link>
                <button
                  onClick={() => logout(navigate)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300 text-red-400"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        variants={containerVariants}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        className="relative pt-20 pb-12 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Picture */}
          <motion.div
            variants={itemVariants}
            className="relative group w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-full h-full rounded-full shadow-2xl flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-purple-500 to-blue-500 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                {isProfileUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader size={32} className="animate-spin text-purple-400" />
                  </div>
                ) : (
                  <img
                    src={
                      authUser?.profilePic ||
                      "/dfp.png"
                    }
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white"
              onClick={() => document.getElementById("profileChangeId").click()}
            >
              <Camera size={20} />
            </motion.button>
          </motion.div>

          <input
            type="file"
            id="profileChangeId"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />

          {/* Profile Info */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {authUser?.username}
            </h1>
            <p className="text-lg md:text-xl sm:text-sm text-gray-300 max-w-2xl mx-auto mb-3.5 leading-relaxed">
              "{authUser?.passion || "No passion added yet."}"
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-300 max-w-2xl mx-auto leading-relaxed">
              <FaMapMarkerAlt className="h-5 w-5 text-green-500" />
              <span className="text-sm sm:text-base md:text-lg">
                {authUser?.location || "Not Added"}
              </span>
            </div>
          </motion.div>



          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-8 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">{myPosts?.length || 0}</div>
              <div className="text-sm text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">{authUser?.followers?.length}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-400">{authUser?.following?.length}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
          </motion.div>

          {/* Add Post Button */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center mt-6 mb-8"
          >
            <Link to="/addpost" className="w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto hover:cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all duration-300"
              >
                <PlusCircle size={24} />
                Add Post
              </motion.button>
            </Link>

            {/* FullBio modalOpen button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto hover:cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all duration-300"
              onClick={handleOpenBioModal}
            >
              <PlusCircle size={24} />
              Edit/Add Full Bio
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Tab Navigation */}
      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden p-4 border-b border-gray-800">
            <button
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              <span>Menu</span>
            </button>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 bg-gray-800/50 rounded-lg"
                >
                  <ul className="space-y-2">
                    <li className="cursor-pointer hover:text-purple-400 transition-colors duration-300">Add Bio</li>
                    <li className="cursor-pointer hover:text-purple-400 transition-colors duration-300">Make Post</li>
                    <li className="cursor-pointer hover:text-purple-400 transition-colors duration-300">Reels</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Headers */}
          <div className="flex border-b border-gray-800">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                className={`flex-1 py-4 px-6 text-lg font-semibold transition-all duration-300 relative ${activeTab === tab
                  ? "text-purple-400 bg-gray-800/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "Posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {myPosts?.length > 0 ? (
                    <div
                      className={`${(myPosts?.length > 6 && window.innerWidth >= 768) ||
                        (myPosts?.length > 3 && window.innerWidth < 768)
                        ? 'max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/50 hover:scrollbar-thumb-purple-500/70'
                        : ''
                        }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* updating here  */}
                        {myPosts.map((post, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={post.postImage}
                                alt="Post"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                              <div className="flex items-center justify-between text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 hover:text-red-400 hover:cursor-pointer transition-colors duration-300"
                                    onClick={() => handleOwnLike(post)}
                                  >
                                    {storeLoadId === post?.user?._id ? (
                                      <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <Heart size={16} className="text-red-500" />
                                        <span className="text-sm font-medium">{post?.likes?.totalLikes}</span>
                                      </div>
                                    )}

                                  </button>
                                  {/* <button className="flex items-center gap-1 hover:text-blue-400 hover:cursor-pointer transition-colors duration-300"
                                    onClick={() => toast.info("Feature coming soon!")}
                                  >
                                    <Share2 size={16} />
                                  </button> */}

                                  {post._id === deleteId ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                                  ) : (
                                    <>
                                      <button onClick={() => handleDeletePost(post._id)} className="flex items-center gap-1 hover:text-red-500 hover:cursor-pointer transition-colors duration-300">
                                        <Trash size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No posts yet</h3>
                      <p className="text-gray-400">Start sharing your thoughts with the world!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "Photos" && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {authUser?.posts?.length > 0 ? (
                    <div
                      className={`${(myPosts?.length > 6 && window.innerWidth >= 768) ||
                        (myPosts?.length > 3 && window.innerWidth < 768)
                        ? 'max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/50 hover:scrollbar-thumb-purple-500/70'
                        : ''
                        }`}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {myPosts?.map((post, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group aspect-square overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <img
                              src={post?.postImage}
                              alt="Post"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white text-sm font-semibold text-center px-2">
                                #{post?.title}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📸</div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No photos yet</h3>
                      <p className="text-gray-400">Upload your first photo to get started!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "Community" && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {communityPosts?.length > 0 ? (
                    <div
                      className={`${(communityPosts.length > 6 && window.innerWidth >= 768) ||
                        (communityPosts.length > 3 && window.innerWidth < 768)
                        ? 'max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-800/50 hover:scrollbar-thumb-purple-500/70'
                        : ''
                        }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {communityPosts.map((post, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={
                                  post.userProfileImage ||
                                  "https://cdn.pixabay.com/photo/2016/11/19/17/28/art-1840481_1280.jpg"
                                }
                                alt="User"
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                              />
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-purple-400 mb-2">
                                  {post.author}
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                  "{post.quote}"
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🌟</div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">Loading community posts...</h3>
                      <p className="text-gray-400">This segment is now on-progess 🏃‍♂️‍➡️..</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Chat-iO
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect, share, and discover amazing content with our vibrant community. Your story matters, and we're here to help you tell it.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`hover:cursor-pointer p-2 rounded-full bg-gray-800/50 ${social.color} hover:bg-gray-700/50 transition-all duration-300`}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">Home</Link></li>
                <li><Link to="/chat" className="hover:text-purple-400 transition-colors duration-300">Chat</Link></li>
                <li><Link to="/allposts" className="hover:text-purple-400 transition-colors duration-300">All Posts</Link></li>
                <li><Link to="/addpost" className="hover:text-purple-400 transition-colors duration-300">Add Post</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>pk5773694@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+91 7735221038</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>DMJ,Odisha</span>
                </li>
                <li className="flex items-center gap-2 ">
                  <Globe size={16} />
                  <a className="hover:underline hover:text-blue-600" href="https://prasan.onrender.com/" target="_blank" rel="noopener noreferrer">Say Hello to Me!</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Chat-i. All rights reserved. Built with ❤️ for the community.</p>
          </div>
        </div>
      </footer>

      {/* Adddingn FullBio form handle configuration here  */}
      <AddFullBio
        isOpen={isFullBioModalOpen}
        onClose={handleCloseBioModal}
      />
    </div>
  );
};

export default ProfilePage;
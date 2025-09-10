import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BarChart3, FileText, Clock, TrendingUp, Calendar, Award, Github, Twitter, Linkedin, Mail, Heart, Phone, MapPin, Globe } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { usePostStore } from '../store/usePostStore.js';
import ChartSkeleton from '../skeletons/ChartSkeleton.jsx';
import { FaGlobe, FaLinkedin } from 'react-icons/fa';

const ChartSession = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [chartData, setChartData] = useState([]);
  const [authUserId, setAuthUserId] = useState(null);
  const [storePosts, setStorePosts] = useState([]);
  const [realPosts, setRealPosts] = useState([]); // For future use if needed

  const { logout, authUser, isFetchingChartData, fetchChartData, chartData: backendChartData } = useAuthStore();
  const { authPost, showPost } = usePostStore();


  const navigate = useNavigate();

  useEffect(() => {
    setAuthUserId(authUser?._id || "Nothing");
  }, [authUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (authUser) {
        await fetchChartData();
      }
    }
    fetchData();
  }, [authUser, fetchChartData]);

  // Fetch and showPosts
  useEffect(() => {
    const fetchPosts = async () => {
      await showPost();
    };
    fetchPosts();
  }, [showPost]);

  // 🔑 Watch authPost and update storePosts when it's ready
  useEffect(() => {
    if (authPost) {
      setStorePosts(authPost);
    }
  }, [authPost]);


  useEffect(() => {
    if (storePosts) {
      const posts = storePosts.filter(post => post.user._id === authUserId);
      setRealPosts(posts);
    }
  }, [storePosts]);


  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} days ago`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} months ago`;
    }
    const years = Math.floor(months / 12);
    return `${years} years ago`;
  };

  // Process backend data when it arrives
  useEffect(() => {
    if (backendChartData && Array.isArray(backendChartData) && backendChartData.length > 0) {
      const processedData = processBackendData(backendChartData);
      setChartData(processedData);
    } else if (backendChartData === null || (Array.isArray(backendChartData) && backendChartData.length === 0)) {
      // Use sample data when no real data is available
      setChartData(generateSampleData());
    }
  }, [backendChartData]);

  // Function to process backend session data
  const processBackendData = (sessions) => {
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return [];
    }

    // Group sessions by date
    const sessionsByDate = {};

    sessions.forEach(session => {
      // Ensure session has required fields
      if (!session.loginTime) return;

      const loginDate = new Date(session.loginTime);
      const dateKey = loginDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!sessionsByDate[dateKey]) {
        sessionsByDate[dateKey] = {
          date: loginDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: dateKey,
          sessions: [],
          totalDuration: 0,
          sessionCount: 0
        };
      }

      // Only include sessions with logout time (completed sessions) or use durationMinutes if available
      if (session.logoutTime || session.durationMinutes > 0) {
        sessionsByDate[dateKey].sessions.push(session);
        sessionsByDate[dateKey].totalDuration += session.durationMinutes || 0;
        sessionsByDate[dateKey].sessionCount += 1;
      }
    });

    // Convert to array and calculate average duration per day
    const processedData = Object.values(sessionsByDate)
      .map(dayData => ({
        date: dayData.date,
        fullDate: dayData.fullDate,
        duration: dayData.sessionCount > 0 ? Math.round(dayData.totalDuration / dayData.sessionCount) : 0,
        totalDuration: dayData.totalDuration,
        sessionCount: dayData.sessionCount,
        sessions: dayData.sessions
      }))
      .filter(dayData => dayData.sessionCount > 0) // Only include days with actual sessions
      .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    return processedData;
  };

  // Fallback sample data generation
  const generateSampleData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const baseDuration = 15 + Math.sin(i * 0.3) * 10;
      const randomVariation = (Math.random() - 0.5) * 20;
      const duration = Math.max(5, Math.min(45, baseDuration + randomVariation));

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        duration: Math.round(duration),
        sessionCount: 1,
        totalDuration: Math.round(duration)
      });
    }
    return data;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/90 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-white font-semibold">{label}</p>
          <p className="text-purple-400 font-bold">
            Avg Duration: {payload[0].value} minutes
          </p>
          {data.sessionCount && (
            <>
              <p className="text-blue-400">
                Total Sessions: {data.sessionCount}
              </p>
              <p className="text-emerald-400">
                Total Duration: {data.totalDuration} minutes
              </p>
            </>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'posts', label: 'Posts', icon: FileText }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Calculate stats from actual data
  const calculateStats = () => {
    if (!chartData || chartData.length === 0) {
      return {
        totalSessions: 0,
        avgDuration: 0,
        bestSession: 0,
        totalDays: 0
      };
    }

    const totalSessions = chartData.reduce((sum, day) => sum + (day.sessionCount || 1), 0);
    const totalMinutes = chartData.reduce((sum, day) => sum + (day.totalDuration || day.duration), 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const bestSession = Math.max(...chartData.map(day => day.duration || 0));

    return {
      totalSessions,
      avgDuration,
      bestSession,
      totalDays: chartData.length
    };
  };

  const stats = calculateStats();

  const statsData = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Avg Duration",
      value: `${stats.avgDuration}m`,
      icon: Clock,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Best Session",
      value: `${stats.bestSession}m`,
      icon: Award,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Active Days",
      value: stats.totalDays,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {authUser?.name || authUser?.username || "User"}
              </h2>
              <p className="text-slate-400">Active User • Premium Member</p>
              {isFetchingChartData && (
                <p className="text-blue-400 text-sm mt-2">Loading session data...</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Performance Analytics
              </h2>
              <p className="text-slate-400">
                {isFetchingChartData
                  ? "Loading your session data..."
                  : backendChartData && Array.isArray(backendChartData) && backendChartData.length > 0
                    ? `Showing data from ${backendChartData.length} session${backendChartData.length !== 1 ? 's' : ''}`
                    : "No session data available yet - start using the app to see your analytics"
                }
              </p>
            </motion.div>

            {isFetchingChartData ? (
              <motion.div
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-2xl flex items-center justify-center h-80"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading your session data...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">Session Duration Trend</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-400">Avg Duration (minutes)</span>
                    </div>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="duration"
                        stroke="url(#gradient)"
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 3, stroke: '#ffffff' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="duration"
                        stroke="url(#gradient)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#8b5cf6' }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 'posts':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Recent Posts
              </h2>
              <p className="text-slate-400">Your latest activities and content</p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-6">
              {realPosts.map((post) => (
                <motion.div
                  key={post}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Post Title {post?.title}
                      </h3>
                      <p className="text-slate-400 mb-3">
                        {post?.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{timeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <span>👍{post?.likes?.totalLikes}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isFetchingChartData && (authPost === null)) {
    return (
      <ChartSkeleton />
    )
  }

  return (
    <div className="min-h-screen bg-slate-850" style={{ backgroundColor: '#0f172a' }}>
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </motion.div>

            <div className="flex space-x-1 bg-slate-700/50 backdrop-blur-sm rounded-full p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white'
                      : 'text-slate-300 hover:text-purple-400'
                      }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:block">{item.label}</span>
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </motion.div>
              <p className="text-slate-400 mb-6 max-w-md">
                Track your performance, monitor your progress, and achieve your goals with our beautiful and intuitive dashboard platform.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: 'https://github.com/prasan-RKP', },
                  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/prasan-kumar-05a623345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
                  { icon: FaGlobe, href: 'https://prasan.onrender.com', },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-slate-800/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-lg flex items-center justify-center border border-slate-700/50 hover:border-transparent transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">

                <motion.li whileHover={{ x: 4 }}>
                  <Link to="/profile" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                    Profile
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 4 }}>
                  <Link to="/allposts" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                    See Posts
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 4 }}>
                  <Link to="/addpost" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                    Add Post
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 4 }}>
                  <button
                    onClick={() => logout(navigate)}
                    className="text-slate-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    LogOut
                  </button>
                </motion.li>


              </ul>
            </div>

            {/* <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Help Center', 'Community', 'Blog'].map((link) => (
                  <motion.li key={link} whileHover={{ x: 4 }}>
                    <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div> */}
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

          <div className="border-t border-slate-700/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © 2025 Chat-Io. All rights reserved.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400 text-sm"
              >
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.div>
                <span>for better productivity</span>
              </motion.div>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChartSession;
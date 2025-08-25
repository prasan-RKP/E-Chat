import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Zap } from 'lucide-react';

const VisitUserSkeleton = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Skeleton shimmer animation
    const shimmerVariants = {
        animate: {
            backgroundPosition: ['200% 0', '-200% 0'],
            transition: {
                duration: 2,
                ease: 'linear',
                repeat: Infinity,
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
        skeletonBg: isDarkMode
            ? "bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50"
            : "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
        text: isDarkMode ? "text-gray-100" : "text-gray-900",
        textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    };

    const SkeletonElement = ({ className, rounded = "rounded-2xl" }) => (
        <motion.div
            className={`${themeClasses.skeletonBg} ${rounded} ${className}`}
            variants={shimmerVariants}
            animate="animate"
            style={{
                backgroundSize: '200% 100%'
            }}
        />
    );

    return (
        <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden transition-all duration-500`}>
            {/* Animated Background Elements */}
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
            </div>

            {/* Header Skeleton */}
            <header className={`backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-white/20'} shadow-2xl border-b sticky top-0 z-50 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Skeleton */}
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <Zap className="text-blue-600" size={32} />
                            </motion.div>
                            <SkeletonElement className="h-8 w-24" />
                        </div>

                        {/* Desktop Navigation Skeleton */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {[1, 2, 3, 4].map((_, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <SkeletonElement className="h-5 w-5 rounded-full" />
                                    <SkeletonElement className="h-4 w-16" />
                                </div>
                            ))}
                        </nav>

                        {/* Action Buttons */}
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

                            <div className="hidden md:flex items-center gap-2">
                                <SkeletonElement className="h-12 w-12 rounded-2xl" />
                                <SkeletonElement className="h-12 w-12 rounded-2xl" />
                            </div>

                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`lg:hidden p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700/50 text-gray-300 border-slate-600/50' : 'bg-white/20 text-gray-700 border-white/20'} backdrop-blur-sm border`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                                {[1, 2, 3, 4].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-3 px-4 py-3"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <SkeletonElement className="h-5 w-5 rounded-full" />
                                        <SkeletonElement className="h-4 w-20" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
                    {/* Profile Card Skeleton */}
                    <motion.div
                        className={`${themeClasses.cardBg} rounded-3xl shadow-2xl border overflow-hidden mb-8 relative transition-all duration-300`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Profile Header Skeleton */}
                        <div className="p-6 sm:p-8 lg:p-10 relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                                {/* Profile Image Skeleton */}
                                <div className="flex-shrink-0 relative mx-auto lg:mx-0">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    />
                                    <SkeletonElement className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full" />
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </motion.div>
                                </div>

                                {/* Profile Info Skeleton */}
                                <div className="flex-1 min-w-0 text-center lg:text-left">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                                        <div>
                                            <SkeletonElement className="h-10 w-48 mb-2 mx-auto lg:mx-0" />
                                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                                <SkeletonElement className="h-6 w-32" />
                                                <SkeletonElement className="h-5 w-5 rounded-full" />
                                            </div>
                                        </div>
                                        <SkeletonElement className="h-12 w-12 rounded-2xl mt-4 lg:mt-0 mx-auto lg:mx-0" />
                                    </div>

                                    {/* Stats Skeleton */}
                                    <div className="grid grid-cols-3 gap-4 lg:gap-8 mb-8">
                                        {[1, 2, 3].map((_, index) => (
                                            <motion.div
                                                key={index}
                                                className={`text-center p-4 lg:p-6 rounded-2xl ${isDarkMode
                                                    ? 'bg-slate-700/30 border-slate-600/30'
                                                    : 'bg-white/50 border-white/20'
                                                } backdrop-blur-sm border transition-all duration-300`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <SkeletonElement className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 rounded-2xl" />
                                                <SkeletonElement className="h-8 w-12 mx-auto mb-2" />
                                                <SkeletonElement className="h-4 w-16 mx-auto" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bio Skeleton */}
                            <div className="space-y-6 text-center lg:text-left">
                                <SkeletonElement className="h-8 w-64 mx-auto lg:mx-0" />
                                <SkeletonElement className="h-6 w-80 mx-auto lg:mx-0" />
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <SkeletonElement className="h-5 w-5 rounded-full" />
                                    <SkeletonElement className="h-5 w-32" />
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <SkeletonElement className="h-5 w-5 rounded-full" />
                                    <SkeletonElement className="h-5 w-28" />
                                </div>
                            </div>

                            {/* Action Buttons Skeleton */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                <SkeletonElement className="flex-1 h-14 lg:h-16" />
                                <SkeletonElement className="flex-1 h-14 lg:h-16" />
                            </div>

                            {/* Interest Icons Skeleton */}
                            <div className="flex justify-center gap-6 lg:gap-8 mt-10">
                                {[1, 2, 3].map((_, index) => (
                                    <SkeletonElement
                                        key={index}
                                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Tabs Skeleton */}
                        <div className={`border-t ${isDarkMode ? 'border-slate-700/50 bg-slate-800/30' : 'border-white/20 bg-white/30'} backdrop-blur-sm`}>
                            <div className="flex relative">
                                {['Posts', 'Liked', 'Tagged'].map((tab, index) => (
                                    <div key={tab} className="flex-1 py-5 lg:py-6 px-6 text-center">
                                        <SkeletonElement className="h-6 w-16 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Posts Grid Skeleton */}
                        <div className="p-6 lg:p-8">
                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {Array(9).fill(null).map((_, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative aspect-square"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <SkeletonElement className="w-full h-full rounded-2xl lg:rounded-3xl" />
                                        {/* Post actions skeleton */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-white/70 dark:bg-slate-800/70 rounded-xl px-3 py-2">
                                            <div className="flex items-center gap-3">
                                                <SkeletonElement className="w-5 h-5 rounded-full" />
                                                <SkeletonElement className="w-8 h-4" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <SkeletonElement className="w-5 h-5 rounded-full" />
                                                <SkeletonElement className="w-6 h-4" />
                                            </div>
                                            <SkeletonElement className="w-5 h-5 rounded-full" />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer Skeleton */}
            <footer className={`w-full py-8 mt-12 text-center ${isDarkMode ? 'bg-slate-900/80 border-t border-slate-700/50' : 'bg-white/80 border-t border-white/20'} backdrop-blur-md`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SkeletonElement className="h-4 w-64 mx-auto mb-4" />
                    <div className="flex justify-center gap-4">
                        {[1, 2, 3].map((_, index) => (
                            <SkeletonElement key={index} className="w-10 h-10 rounded-full" />
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VisitUserSkeleton;
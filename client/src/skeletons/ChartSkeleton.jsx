import React from 'react';
import { motion } from 'framer-motion';
import { User, BarChart3, FileText, Clock, TrendingUp, Calendar, Award, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const ChartSkeleton = () => {
  // Enhanced shimmer animation with multiple effects
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: Math.random() * 0.5
    }
  };

  const pulseEffect = {
    initial: { opacity: 0.3 },
    animate: { opacity: [0.3, 0.6, 0.3] },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  const SkeletonBox = ({ className = '', children, variant = 'default' }) => (
    <motion.div 
      className={`relative overflow-hidden bg-slate-700/30 rounded-lg ${className}`}
      variants={pulseEffect}
      initial="initial"
      animate="animate"
    >
      {/* Main shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/40 to-transparent"
        variants={shimmer}
        initial="initial"
        animate="animate"
      />
      
      {/* Secondary shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
        variants={{
          initial: { x: '-100%', rotate: 25 },
          animate: { x: '100%', rotate: 25 }
        }}
        initial="initial"
        animate="animate"
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3
        }}
      />
      
      {/* Sparkle effect for special elements */}
      {variant === 'special' && (
        <>
          <motion.div
            className="absolute top-2 right-2 w-1 h-1 bg-white/80 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.2
            }}
          />
          <motion.div
            className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-purple-300/60 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: 0.8
            }}
          />
        </>
      )}
      
      {children}
    </motion.div>
  );

  const SkeletonText = ({ className = '', special = false }) => (
    <SkeletonBox className={`h-4 ${className}`} variant={special ? 'special' : 'default'} />
  );

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'posts', label: 'Posts', icon: FileText }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0f172a'}}>
      {/* Navigation Skeleton */}
      <nav className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <SkeletonBox className="w-8 h-8 rounded-lg" variant="special" />
              <SkeletonBox className="w-24 h-6 rounded" variant="special" />
            </div>

            <div className="flex space-x-1 bg-slate-700/50 backdrop-blur-sm rounded-full p-1">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                >
                  <item.icon className="w-4 h-4 text-slate-600" />
                  <SkeletonBox className="w-16 h-4 rounded hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header Skeleton */}
          <div className="text-center">
            <div className="relative inline-block">
              <SkeletonBox className="w-24 h-24 rounded-full mx-auto mb-4" variant="special" />
              <motion.div 
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-700/50 rounded-full border-4 border-slate-800"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    "0 0 0 8px rgba(34, 197, 94, 0)",
                    "0 0 0 0 rgba(34, 197, 94, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <SkeletonText className="w-32 mx-auto mb-2" special />
            <SkeletonText className="w-48 mx-auto" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(168, 85, 247, 0.1)",
                    "0 0 20px 0 rgba(168, 85, 247, 0.2)",
                    "0 0 0 0 rgba(168, 85, 247, 0.1)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.5 
                }}
              >
                {/* Floating particles effect */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-purple-400/40 rounded-full"
                  animate={{
                    y: [-20, -40, -20],
                    x: [-10, 10, -10],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
                <SkeletonBox className="w-12 h-12 rounded-xl mb-3" variant="special" />
                <SkeletonText className="w-16 h-8 mb-2" special />
                <SkeletonText className="w-20 h-4" />
              </motion.div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden"
            animate={{
              borderColor: [
                "rgba(71, 85, 105, 0.5)",
                "rgba(168, 85, 247, 0.3)",
                "rgba(71, 85, 105, 0.5)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Animated data flow lines */}
            <motion.div
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <SkeletonText className="w-48 h-6 mb-2 sm:mb-0" special />
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(168, 85, 247, 0.4)",
                        "0 0 0 6px rgba(168, 85, 247, 0)",
                        "0 0 0 0 rgba(168, 85, 247, 0.4)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <SkeletonText className="w-24 h-4" />
                </div>
              </div>
            </div>

            {/* Chart Area Skeleton */}
            <div className="h-80 w-full relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonText key={i} className="w-8 h-3" />
                ))}
              </div>
              
              {/* Chart area */}
              <div className="ml-12 mr-4 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="absolute w-full border-t border-slate-700/30" 
                      style={{ top: `${(i - 1) * 25}%` }}
                    />
                  ))}
                </div>
                
                {/* Chart line simulation with animated bars */}
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <motion.div
                      key={i} 
                      className="w-2 rounded-t bg-gradient-to-t from-slate-600/40 to-purple-400/30"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                      animate={{
                        height: [
                          `${Math.random() * 60 + 20}%`,
                          `${Math.random() * 60 + 40}%`,
                          `${Math.random() * 60 + 20}%`
                        ],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-12 right-4 flex justify-between">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonText key={i} className="w-12 h-3" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Posts Skeleton with enhanced loading effects */}
          <div className="space-y-6">
            {[1, 2, 3].map((post) => (
              <motion.div
                key={post}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden"
                animate={{
                  y: [0, -2, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: post * 0.3
                }}
              >
                {/* Content loading indicator */}
                <motion.div
                  className="absolute right-4 top-4 flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[1, 2, 3].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-1.5 h-1.5 bg-purple-400/60 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: dot * 0.2
                      }}
                    />
                  ))}
                </motion.div>
                
                <div className="flex items-start gap-4">
                  <SkeletonBox className="w-12 h-12 rounded-xl flex-shrink-0" variant="special" />
                  <div className="flex-1 space-y-3">
                    <SkeletonText className="w-3/4 h-6" special />
                    <div className="space-y-2">
                      <SkeletonText className="w-full" />
                      <SkeletonText className="w-5/6" />
                    </div>
                    <div className="flex items-center gap-4">
                      <SkeletonText className="w-16 h-3" />
                      <SkeletonText className="w-2 h-3" />
                      <SkeletonText className="w-20 h-3" />
                      <SkeletonText className="w-2 h-3" />
                      <SkeletonText className="w-16 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <SkeletonBox className="w-10 h-10 rounded-xl" variant="special" />
                <SkeletonText className="w-32 h-6" special />
              </div>
              <div className="space-y-2 mb-6">
                <SkeletonText className="w-full max-w-md" />
                <SkeletonText className="w-3/4 max-w-md" />
                <SkeletonText className="w-1/2 max-w-md" />
              </div>
              <div className="flex gap-4">
                {[Github, Twitter, Linkedin, Mail].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    animate={{
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    <SkeletonBox className="w-10 h-10 rounded-lg" variant="special" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <SkeletonText className="w-24 h-5 mb-4" special />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonText key={i} className="w-20 h-4" />
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <SkeletonText className="w-20 h-5 mb-4" special />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonText key={i} className="w-24 h-4" />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <SkeletonText className="w-48 h-4" />
              <div className="flex items-center gap-2">
                <SkeletonText className="w-20 h-4" />
                <Heart className="w-4 h-4 text-slate-600" />
                <SkeletonText className="w-28 h-4" />
              </div>
              <div className="flex gap-6">
                <SkeletonText className="w-24 h-4" />
                <SkeletonText className="w-28 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChartSkeleton;
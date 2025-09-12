// components/NoPosts.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Plus, Heart, Star } from "lucide-react";

const NoPosts = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[75vh] text-center px-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated background elements */}
      <motion.div
        className="absolute -inset-32 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-10 left-10 w-32 h-32 border border-purple-300/20 rounded-full" />
        <div className="absolute bottom-20 right-16 w-24 h-24 border border-pink-300/20 rounded-full" />
        <div className="absolute top-32 right-8 w-16 h-16 border border-blue-300/20 rounded-full" />
      </motion.div>

      {/* Main content container */}
      <motion.div
        className="relative z-10 backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        whileHover={{ y: -5 }}
      >
        {/* Decorative icons */}
        <div className="absolute -top-4 -left-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
          </motion.div>
        </div>
        <div className="absolute -top-2 -right-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-pink-400 fill-current" />
          </motion.div>
        </div>

        {/* Central illustration */}
        <motion.div
          className="relative mb-8 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {/* Glowing backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Main icon container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-xl flex items-center justify-center">
            <motion.div
              className="text-6xl"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              📝
            </motion.div>
          </div>
          
          {/* Floating sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              y: [-5, -15, -5],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-yellow-300 fill-current" />
          </motion.div>
        </motion.div>

        {/* Title with enhanced styling */}
        <motion.h2
          className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          No Posts Yet, Drop One 
        </motion.h2>

        {/* Subtitle with better typography */}
        <motion.p
          className="text-slate-300 text-lg max-w-sm mx-auto mb-8 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Every great story begins with a single Post. 
          <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold"> Start yours today.</span>
        </motion.p>

        {/* Enhanced CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/addPost"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 overflow-hidden"
          >
            {/* Button background animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Button content */}
            <div className="relative flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Plus className="w-6 h-6" />
              </motion.div>
              <span className="group-hover:tracking-wide transition-all duration-300">
                Drop First Post
              </span>
            </div>
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full"
              whileHover={{ translateX: "200%" }}
              transition={{ duration: 0.6 }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom decorative elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NoPosts;
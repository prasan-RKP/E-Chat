import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ userName, userProfilePic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-end gap-2 p-1 mb-2"
    >
      {/* User Avatar */}
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
          alt="User Avatar"
          src={userProfilePic || "/dfp.png"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Typing Bubble */}
      <div className="bg-gray-700 text-white p-3 rounded-lg max-w-xs relative">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-300 mr-2">
            {userName?.length > 12
              ? userName.slice(0, 12) + "..."
              : userName} is typing
          </span>

          {/* Animated Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
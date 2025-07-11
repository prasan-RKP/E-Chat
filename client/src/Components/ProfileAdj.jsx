import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const ProfileAdj = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="p-2 bg-slate-800 text-white rounded-full shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4"
        >
          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-indigo-950">AddBio</li>
            <li className="cursor-pointer hover:text-indigo-950">MakePost</li>
            <li className="cursor-pointer hover:text-indigo-950">Reels</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileAdj;
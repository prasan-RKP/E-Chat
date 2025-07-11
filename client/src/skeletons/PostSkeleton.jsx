import React from "react";

const PostSkeleton = () => {
  return (
    <div className="relative group overflow-hidden rounded-xl shadow-xl bg-gray-800 animate-pulse">
      <div className="w-full h-[290px] bg-gray-700"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;

import React from "react";

const GifLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="p-4  rounded-lg shadow-lg">
        <img
          src="/gifo.gif"
          alt="Loading..."
          className="w-24 h-24 text-white mix-blend-multiply"
        />
        <p className="text-white text-sm mt-2 text-center">Loading...</p>
      </div>
    </div>
  );
};

export default GifLoader;

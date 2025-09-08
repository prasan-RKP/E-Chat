import { X } from "lucide-react";
import React from "react";

const PinnedMessage = ({
  pinnedMessage,
  handleScrollToPinnedMessage,
  setPinnedMessage,
}) => {
  return (
    <div>
      {pinnedMessage && (
        <div
          onClick={handleScrollToPinnedMessage}
          className="bg-gray-800 text-gray-300 flex items-center justify-between p-2 px-4 border-b border-gray-700 sticky top-0 z-10"
        >
          <button className="flex items-center gap-2 text-left w-full">
            📌
            <span className="whitespace-normal break-words max-w-[250px] sm:max-w-[350px] md:max-w-[500px]">
              {pinnedMessage.text || "Pinned Image"}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent accidental scroll
              setPinnedMessage(null);
            }}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PinnedMessage;

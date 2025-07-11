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
          <button className="flex items-center gap-2">
            📌{" "}
            <span className="truncate">
              {pinnedMessage.text || "Pinned Image"}
            </span>
          </button>
          <button
            onClick={() => setPinnedMessage(null)}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PinnedMessage;

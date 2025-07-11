import { Ellipsis } from "lucide-react";

const MessagesSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => {
        const isUserMessage = index % 2 === 0; // Alternating sender and receiver

        return (
          <div
            key={index}
            className={`chat ${isUserMessage ? "chat-end" : "chat-start"}`}
          >
            {/* Profile Picture Skeleton */}
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-gray-600 animate-pulse"></div>
            </div>

            <div className="chat-bubble bg-gray-600 animate-pulse w-48 h-6"></div>

            {/* Timestamp Skeleton */}
            {/* <time className="text-xs opacity-50 bg-gray-600 w-16 h-3 rounded-md animate-pulse"></time> */}
          </div>
        );
      })}

      <div>
        <div className="flex items-center gap-2">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    </div>
  );
};

export default MessagesSkeleton;

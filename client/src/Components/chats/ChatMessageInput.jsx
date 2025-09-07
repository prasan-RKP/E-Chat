import React, { useRef, useState, useEffect } from "react";
import { ImagePlus, Send, X, Smile, Mic } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";

const ChatMessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null); // ⬅️ emoji picker ref
  const { selectedUser, sendMessage, handleTyping, stopTyping } = useChatStore();

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false); // close after selecting (optional)
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (newText.trim() && selectedUser) handleTyping();
    else if (!newText.trim()) stopTyping();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      toast.error("Please enter a message or select an image.");
      return;
    }
    stopTyping();
    sendMessage({ text: text.trim(), image });
    setText("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-gray-800 p-2 sm:p-4 shadow-lg relative">
      {/* Emoji picker dropdown */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-16 left-4 z-50 bg-gray-900 rounded-lg shadow-lg"
        >
          <EmojiPicker
            theme="dark"
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
          />
        </div>
      )}

      <form onSubmit={handleSendMessage}>
        <div className="flex gap-1 sm:gap-2">
          <div className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-gray-700 relative">
            <button
              type="button"
              className="hover:cursor-pointer text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <input
              className="flex-1 bg-transparent text-gray-300 focus:outline-none border-none ring-0 text-sm sm:text-base min-w-0"
              placeholder="Type a message..."
              value={text}
              onChange={handleTextChange}
              disabled={!selectedUser}
            />

            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0 hover:scale-110 hover:cursor-pointer"
              onClick={() => toast.info("Voice messages coming soon! 🎤")}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
          />

          <button
            type="button"
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0 hover:cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <button
            type="submit"
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0 hover:cursor-pointer"
          >
            <Send className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageInput;

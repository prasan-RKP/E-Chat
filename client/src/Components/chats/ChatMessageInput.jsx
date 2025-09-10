import React, { useRef, useState, useEffect } from "react";
import { ImagePlus, Send, X, Smile, Mic, Loader2 } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";

const ChatMessageInput = ({ isSendingMessaging }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { selectedUser, sendMessage, handleTyping, stopTyping } = useChatStore();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
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
    setShowEmojiPicker(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-800 p-2 sm:p-4 shadow-lg relative">
      {/* Emoji picker dropdown */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-16 left-4 z-50 bg-gray-900 rounded-lg shadow-lg"
        >
          <EmojiPicker theme="dark" onEmojiClick={handleEmojiClick} autoFocusSearch={false} />
        </div>
      )}

      <form onSubmit={handleSendMessage}>
        <div className="flex gap-1 sm:gap-2">
          {/* Input box */}
          <div className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-gray-700 relative">

            {/* Image Preview in Top-Left */}
            {image && (
              <div className="absolute -top-16 left-2">
                <div className="relative">
                  <img
                    src={image}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded border border-gray-500 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-1 -right-1 bg-black/70 text-red-500 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Emoji Button */}
            <button
              type="button"
              className="hover:cursor-pointer text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Text Input */}
            <input
              className="flex-1 bg-transparent text-gray-300 focus:outline-none border-none ring-0 text-sm sm:text-base min-w-0"
              placeholder="Type a message..."
              value={text}
              onChange={handleTextChange}
              disabled={!selectedUser}
            />

            {/* Mic Button */}
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0 hover:scale-110 hover:cursor-pointer"
              onClick={() => toast.info("Voice messages coming soon! 🎤")}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Select Image Button */}
          <button
            type="button"
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0 hover:cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-shrink-0 hover:cursor-pointer flex items-center justify-center"
            disabled={isSendingMessaging}
          >
            {isSendingMessaging ? (
              <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-6 sm:h-6" />
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default ChatMessageInput;

import React, { useRef, useState } from "react";
import { ImagePlus, Send, X, Smile, Mic } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { toast } from "sonner";

const ChatMessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const { selectedUser, sendMessage, handleTyping, stopTyping } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type || !file.name) {
      toast.error("Invalid or missing file.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be under 10MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image 📷");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  // NEW: Handle text change with typing indicator
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    // Only trigger typing if there's actually text being typed
    if (newText.trim() && selectedUser) {
      handleTyping();
    } else if (!newText.trim()) {
      // Stop typing when input is empty
      stopTyping();
    }
  };

  // NEW: Handle input blur (when user clicks away)
  const handleInputBlur = () => {
    stopTyping();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      toast.error("Please enter a message or select an image.");
      return;
    }

    // Stop typing when sending message
    stopTyping();

    sendMessage({
      text: text.trim(),
      image: image,
    });

    setText("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-gray-800 p-2 sm:p-4 shadow-lg relative">
      {image && (
        <div className="absolute left-2 -top-24 sm:-top-28 w-20 h-20 sm:w-28 sm:h-28 rounded-lg shadow-lg border border-gray-600">
          <img
            src={image}
            alt="Selected"
            className="w-full h-full rounded-lg object-cover"
          />
          <button
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-transform scale-110"
            onClick={removeImage}
          >
            <X className="w-3 h-3 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage}>
        <div className="flex gap-1 sm:gap-2">
          <div className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-gray-700">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <input
              className="flex-1 bg-transparent text-gray-300 focus:outline-none border-none ring-0 text-sm sm:text-base min-w-0"
              placeholder="Type a message..."
              value={text}
              onChange={handleTextChange} // Updated to use new handler
              onBlur={handleInputBlur}   // NEW: Handle blur event
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
            onChange={handleImageChange}
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
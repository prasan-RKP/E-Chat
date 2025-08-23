import { useEffect, useState, useRef } from "react";
import { MessageSquareText, Loader2, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import ChatSidebar from "../Components/chats/ChatSidebar";
import ChatHeader from "../Components/chats/ChatHeader";
import { useChatStore } from "../store/useChatStore";
import ChatMessageInput from "../Components/chats/ChatMessageInput";
import { useAuthStore } from "../store/useAuthStore";
import MessagesSkeleton from "../skeletons/MessagesSkeleton.jsx";
import MessageDropdown from "../assets/MessageDropdown.jsx";
import moment from "moment";
import PinnedMessage from "../assets/PinnedMessage.jsx";
import ModalImage from "../assets/ModalImage.jsx";

const ChatComponent = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    isFetchingMessage,
    isSendingMessaging,
    subscribeToMessages,
    unSubscribeFromMessages,
    removeMessageAction
  } = useChatStore();
  const { authUser } = useAuthStore();

  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [dropdownMessage, setDropdownMessage] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const messageRefs = useRef({});
  const longPressTimer = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const dropdownRef = useRef(null);

  const [removeMessages, setRemoveMessages] = useState(messages);

  useEffect(() => {
    // Check if device is touch-enabled
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    subscribeToMessages();

    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    return () => unSubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unSubscribeFromMessages]);

  // Add effect to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownMessage(null);
      }
    };

    // Add event listener when dropdown is open
    if (dropdownMessage !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownMessage]);

  // Handle long press on touch devices
  const handleTouchStart = (index) => {
    if (!isTouchDevice) return;
    
    longPressTimer.current = setTimeout(() => {
      setDropdownMessage(dropdownMessage === index ? null : index);
    }, 500); // 500ms delay for long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  // Scroll to pinned message when clicked
  const handleScrollToPinnedMessage = () => {
    if (pinnedMessage && messageRefs.current[pinnedMessage._id]) {
      messageRefs.current[pinnedMessage._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add highlight effect
      messageRefs.current[pinnedMessage._id].classList.add("bg-gray-700");
      setTimeout(() => {
        messageRefs.current[pinnedMessage._id].classList.remove("bg-gray-700");
      }, 1000);
    }
  };

  const removeMessage = (message) => {
    if (window.confirm("Are you sure you want to delete the message ? ")) {
      console.log('The doubt messageId', message._id);
      removeMessageAction(message);
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />

        {/* Pinned Message Bar */}
        <PinnedMessage
          pinnedMessage={pinnedMessage}
          handleScrollToPinnedMessage={handleScrollToPinnedMessage}
          setPinnedMessage={setPinnedMessage}
        />

        <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-900">
          {!selectedUser ? (
            <motion.div
              className="flex flex-col items-center text-gray-400 h-full justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <MessageSquareText className="w-12 h-12 sm:w-18 sm:h-18" />
              <p className="mt-2 text-sm sm:text-base">Select a user to start chatting</p>
            </motion.div>
          ) : (
            <div className="flex-1 space-y-2 sm:space-y-4">
              {isFetchingMessage ? (
                <MessagesSkeleton />
              ) : messages.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center text-gray-400"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <p className="mt-16 text-center text-sm sm:text-base">Continue your chat</p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    ref={(el) => (messageRefs.current[message._id] = el)}
                    className={`relative flex items-end gap-1 sm:gap-2 p-1 transition-all duration-200 ${message.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                      }`}
                    onMouseEnter={() => !isTouchDevice && setHoveredMessage(index)}
                    onMouseLeave={() => {
                      if (!isTouchDevice) {
                        setHoveredMessage(null);
                        if (index < messages.length - 2) {
                          setDropdownMessage(null);
                        }
                      }
                    }}
                    onTouchStart={() => handleTouchStart(index)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}
                  >
                    {message.senderId !== authUser._id && (
                      <div className="hidden sm:block w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          alt="User Avatar"
                          src={selectedUser.profilePic || "/dfp.png"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="relative max-w-[85%] sm:max-w-xs bg-gray-800 text-white p-2 sm:p-4 rounded-lg">
                      <div className="text-xs sm:text-sm md:text-base break-words">
                        {message.text}
                      </div>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Sent media"
                          className="mt-1 sm:mt-2 rounded-lg max-w-full cursor-pointer"
                          onClick={() => setModalImage(message.image)}
                        />
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        <p className="text-xs">
                          {moment(message.createdAt).format(
                            window.innerWidth < 640 ? "MMM Do, h:mm a" : "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </p>
                      </div>
                    </div>
                    {message.senderId === authUser._id && (
                      <div className="hidden sm:block w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          alt="User Avatar"
                          src={authUser?.profilePic || "/dfp.png"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Show dropdown on hover (desktop) or long press (mobile) */}
                    {(hoveredMessage === index || dropdownMessage === index) && (
                      <div className={`ml-1 sm:ml-2 relative flex-shrink-0`}>
                        {!isTouchDevice && (
                          <button
                            className={`text-gray-400 hover:text-white`}
                            onClick={() =>
                              setDropdownMessage(
                                dropdownMessage === index ? null : index
                              )
                            }
                          >
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                        {dropdownMessage === index && (
                          <div
                            ref={dropdownRef}
                            className={`absolute mt-2 w-28 sm:w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-md p-2 flex flex-col z-50 ${index >= messages.length - 2
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                              } ${message.senderId === authUser._id
                                ? "right-0"
                                : "left-0"
                              }`}
                          >
                            <MessageDropdown
                              message={message}
                              onPinMessage={() => setPinnedMessage(message)}
                              removeMessage={() => removeMessage(message)}
                              onClose={() => setDropdownMessage(null)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              {isSendingMessaging && (
                <div className="flex justify-end pr-2 sm:pr-6">
                  <span className="text-xs sm:text-sm">Sending...</span>
                  <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 animate-spin ml-1 sm:ml-2" />
                </div>
              )}
            </div>
          )}
        </div>
        {selectedUser && <ChatMessageInput />}
      </div>

      <ModalImage modalImage={modalImage} setModalImage={setModalImage} />
    </div>
  );
};

export default ChatComponent;
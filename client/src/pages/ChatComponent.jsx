import { useEffect, useState, useRef } from "react";
import { MessageSquareText, Loader2, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import SendModal from "../Components/openModals/SendModal.jsx";
import TypingIndicator from "../Components/chats/TypingIndicator.jsx";
import { toast } from 'sonner';

const ChatComponent = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    isFetchingMessage,
    isSendingMessaging,
    subscribeToMessages,
    unSubscribeFromMessages,
    deleteFromBoth,
    isDeletingBoth,
    typingUsers,
    setSelectedUser
  } = useChatStore();
  const { authUser } = useAuthStore();

  const [forwardMessage, setForwardMessage] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [dropdownMessage, setDropdownMessage] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const messageRefs = useRef({});
  const longPressTimer = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const dropdownRef = useRef(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const messagesEndRef = useRef(null);


  // cleanUP function
  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      setSelectedUser(null);
      // If you have a setMessages action in your store, use it:
      // setMessages([]);

      // Alternatively, you can reset the store state directly:
      useChatStore.setState({ messages: [] });
    };
  }, [setSelectedUser]);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    subscribeToMessages();

    if (selectedUser) {
      getMessages(selectedUser?._id);
    }

    return () => unSubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unSubscribeFromMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownMessage(null);
      }
    };

    if (dropdownMessage !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownMessage]);

  const handleTouchStart = (index) => {
    if (!isTouchDevice) return;

    longPressTimer.current = setTimeout(() => {
      setDropdownMessage(dropdownMessage === index ? null : index);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleScrollToPinnedMessage = () => {
    if (pinnedMessage && messageRefs.current[pinnedMessage._id]) {
      messageRefs.current[pinnedMessage._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      messageRefs.current[pinnedMessage._id].classList.add("bg-gray-700");
      setTimeout(() => {
        messageRefs.current[pinnedMessage._id].classList.remove("bg-gray-700");
      }, 1000);
    }
  };

  const handleDeleteFromBoth = async (messageId) => {
    console.log(`Attempting to delete message with ID: ${messageId}`);

    setDeletingMessageId(messageId);

    try {
      await deleteFromBoth(messageId);
      setDropdownMessage(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    } finally {
      setDeletingMessageId(null);
    }
  }

  const isSelectedUserTyping = selectedUser && typingUsers[selectedUser?._id];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />

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
              <MessageSquareText className="w-16 h-16 sm:w-18 sm:h-18" />
              <p className="mt-2 text-sm sm:text-base">Select a Friend to Chat 💬</p>
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
                messages.map((message, index) => {
                  // Use current authUser directly instead of refs
                  const isOwnMessage = message?.senderId === authUser?._id ||
                    (typeof message?.senderId === 'object' && message?.senderId?._id === authUser?._id);
                  const userProfilePic = authUser?.profilePic || "/dfp.png";
                  return (
                    <div
                      key={message._id}
                      ref={(el) => (messageRefs.current[message?._id] = el)}
                      className={`relative flex items-end gap-1 sm:gap-2 p-1 transition-all duration-200 ${isOwnMessage
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
                      {!isOwnMessage && (
                        <div className="hidden sm:block w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            alt="User Avatar"
                            src={selectedUser?.profilePic || "/dfp.png"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="relative max-w-[85%] sm:max-w-xs bg-gray-800 text-white p-2 sm:p-4 rounded-lg">
                        {deletingMessageId === message?._id && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
                            <div className="flex items-center gap-2 text-white">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-xs">Deleting...</span>
                            </div>
                          </div>
                        )}

                        <div className="text-xs sm:text-sm md:text-base break-words">
                          {message?.text}
                        </div>
                        {message?.image && (
                          <img
                            src={message?.image}
                            alt="Sent media"
                            className="mt-1 sm:mt-2 rounded-lg max-w-full cursor-pointer"
                            onClick={() => setModalImage(message?.image)}
                          />
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          <p className="text-xs">
                            {moment(message?.createdAt).format(
                              window.innerWidth < 640 ? "MMM Do, h:mm a" : "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </p>
                        </div>
                      </div>
                      {isOwnMessage && (
                        <div className="hidden sm:block w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            alt="User Avatar"
                            src={userProfilePic}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

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
                                } ${isOwnMessage
                                  ? "right-0"
                                  : "left-0"
                                }`}
                            >
                              <MessageDropdown
                                message={message}
                                onPinMessage={() => setPinnedMessage(message)}
                                onClose={() => setDropdownMessage(null)}
                                handleDeleteFromBoth={() => handleDeleteFromBoth(message?._id)}
                                onForward={() => setForwardMessage(message)}
                                isDeleting={deletingMessageId === message?._id || isDeletingBoth}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/*  */}
              {isSendingMessaging && (
                <div className="flex justify-end p-1">
                  <div className="max-w-[85%] sm:max-w-xs bg-gray-700 text-gray-400 p-2 sm:p-4 rounded-lg flex items-center gap-2">
                    <span className="text-xs">Sending...</span>
                    <Loader2 className="w-4 h-4 animate-spin" />  
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isSelectedUserTyping && (
                <TypingIndicator
                  userName={selectedUser?.username}
                  userProfilePic={selectedUser?.profilePic}
                />
              )}
              {/* Scroll anchor for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Modal for viewing images */}
        <AnimatePresence>
          {modalImage && (
            <ModalImage
              src={modalImage}
              onClose={() => setModalImage(null)}
            />
          )}
        </AnimatePresence>

        {/* Forward message modal */}
        <AnimatePresence>
          {forwardMessage && (
            <SendModal
              open={!!forwardMessage}
              message={forwardMessage}
              onClose={() => setForwardMessage(null)}
            />
          )}
        </AnimatePresence>

        {/* Message input */}
        {selectedUser && (
          <ChatMessageInput
            selectedUser={selectedUser}
            isSendingMessaging={isSendingMessaging}
          />
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
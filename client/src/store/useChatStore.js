import { create } from "zustand";
import { axiosMessageInstance } from "../lib/axiosMessage.js";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isSidebarOpen: false,
  isSendingMessaging: false,
  isFetchingMessage: false,
  isRemovingMessage: false,
  isDeletingBoth: false,
  

  // NEW: Typing indicator state
  typingUsers: {}, // userId -> true/false
  typingTimeout: null,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosMessageInstance.get("/fetchUser");
      set({ users: res.data });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong.. 😟");
      }
    } finally {
      set({ isUserLoading: false });
    }
  },

  setSelectedUser: async (userData) => {
    try {
      set({ selectedUser: userData });
    } catch (error) {
      toast.error("Something error occured");
    }
  },

  setIsSidebarOpen: async (data) => {
    set({ isSidebarOpen: data });
  },

  getMessages: async (userId) => {
    set({ isFetchingMessage: true });
    try {
      const res = await axiosMessageInstance.get(`/getMessages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong 😴");
      }
    } finally {
      set({ isFetchingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      const { messages, selectedUser } = get();

      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        set({ messages: [...messages, newMessage] });
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      const { messages } = get();
      set({ messages: messages.filter((msg) => msg._id !== messageId) });
    });

    socket.on(
      "messageDeletedFromBoth",
      ({ messageId, deletedBy, conversationWith }) => {
        const { messages } = get();
        const updatedMessages = messages.filter((msg) => msg._id !== messageId);
        set({ messages: updatedMessages });

        const { authUser } = useAuthStore.getState();
        if (deletedBy !== authUser?._id) {
          toast.info("A message was deleted");
        }
      }
    );

    // ✅ NEW: Typing indicator listeners
    socket.on("typing", ({ senderId }) => {
      console.log("📨 Typing event received from:", senderId);
      const { selectedUser } = get();
      if (selectedUser && senderId === selectedUser._id) {
        console.log("✅ Setting typing indicator for:", senderId);
        set({
          typingUsers: { ...get().typingUsers, [senderId]: true },
        });
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      const { selectedUser } = get();
      if (selectedUser && senderId === selectedUser._id) {
        console.log("✅ Removing typing indicator for:", senderId);
        set({
          typingUsers: { ...get().typingUsers, [senderId]: false },
        });
      }
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageDeletedFromBoth");
    socket.off("typing"); // ✅ cleanup
    socket.off("stopTyping"); // ✅ cleanup
  },

  removeMessageAction: async (messageData) => {
    set({ isRemovingMessage: true });
    try {
      const res = await axiosMessageInstance.post(
        `/removeMsg/${messageData._id}`
      );
      set({ messages: res.data });
      toast.success("Message deleted successfully");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong 😴");
      }
    } finally {
      set({ isRemovingMessage: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessaging: true });

    try {
      const receiverId = data.receiverId || selectedUser?._id;
      if (!receiverId) throw new Error("No receiver specified");

      const res = await axiosMessageInstance.post(
        `/sendMessage/${receiverId}`,
        {
          text: data.text || "",
          image: data.image || null,
        }
      );

      if (receiverId === selectedUser?._id) {
        set({ messages: [...messages, res.data] });
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      throw error;
    } finally {
      set({ isSendingMessaging: false });
    }
  },

  forwardMessage: async (messageData, receiverIds) => {
    set({ isSendingMessaging: true });

    try {
      const results = await Promise.allSettled(
        receiverIds.map((receiverId) =>
          axiosMessageInstance.post(`/sendMessage/${receiverId}`, {
            text: messageData.text || "",
            image: messageData.image || null,
          })
        )
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successful > 0) {
        toast.success(
          `Message forwarded to ${successful} user${
            successful !== 1 ? "s" : ""
          }`
        );
      }
      if (failed > 0) {
        toast.error(
          `Failed to send to ${failed} user${failed !== 1 ? "s" : ""}`
        );
      }

      return { successful, failed };
    } catch (error) {
      toast.error("Failed to forward message");
      throw error;
    } finally {
      set({ isSendingMessaging: false });
    }
  },

  deleteFromBoth: async (messageId) => {
    set({ isDeletingBoth: true });
    try {
      await axiosMessageInstance.delete("/delete-both", {
        data: { messageId },
      });
      toast.success("Message deleted for everyone");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    } finally {
      set({ isDeletingBoth: false });
    }
  },

  // 'Translation' feature starts from here.

  isTranslating: false, // NEW: Translation loading state
  // NEW: Translation functionality
  translateMessage: async ({ messageId, text, langCode }) => {
    set({ isTranslating: true });
    try {
      console.log('Translating message:', { messageId, text, langCode });
      
      const res = await axiosMessageInstance.post('/translate', {
        messageId,
        text,
        langCode
      });

      console.log('Translation response:', res.data);
      
      if (res.data.success) {
        toast.success(`Message translated to ${res.data.targetLanguage}`);
        return {
          translatedText: res.data.translatedText,
          sourceLanguage: res.data.sourceLanguage,
          targetLanguage: res.data.targetLanguage
        };
      } else {
        throw new Error(res.data.message || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to translate message';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isTranslating: false });
    }
  },
  
  // 'Translation' feature Ends from here.

  // ✅ NEW: Typing actions
  startTyping: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (socket && authUser && selectedUser) {
      socket.emit("typing", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }
  },

  stopTyping: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    if (socket && authUser && selectedUser) {
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }
  },

  handleTyping: () => {
    const { startTyping, stopTyping, typingTimeout } = get();

    if (typingTimeout) clearTimeout(typingTimeout);

    startTyping();

    const newTimeout = setTimeout(() => {
      stopTyping();
      set({ typingTimeout: null });
    }, 2000);

    set({ typingTimeout: newTimeout });
  },
}));
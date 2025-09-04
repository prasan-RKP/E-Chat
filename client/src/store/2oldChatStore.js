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
      
      // Only add message if it's for current conversation
      if (selectedUser && (
        newMessage.senderId === selectedUser._id || 
        newMessage.receiverId === selectedUser._id
      )) {
        set({ messages: [...messages, newMessage] });
      }
    });

    // Listen for old message deletion (single user)
    socket.on("messageDeleted", ({ messageId }) => {
      const { messages } = get();
      const updatedMessages = messages.filter((msg) => msg._id !== messageId);
      set({ messages: updatedMessages });
    });

    // NEW: Listen for message deletion from both sides
    socket.on("messageDeletedFromBoth", ({ messageId, deletedBy, conversationWith }) => {
      console.log("Received deletion event:", { messageId, deletedBy, conversationWith });
      
      const { messages } = get();
      
      // Update messages by removing the deleted one
      const updatedMessages = messages.filter(msg => msg._id !== messageId);
      set({ messages: updatedMessages });
      
      // Show notification (only if not deleted by current user)
      const { authUser } = useAuthStore.getState();
      if (deletedBy !== authUser?._id) {
        toast.info("A message was deleted");
      }
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageDeletedFromBoth"); // NEW: Clean up deletion listener
  },

  // Old remove message functionality (single user delete)
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

  // Send message functionality
  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessaging: true });

    try {
      // Use receiverId from data (for forwarding) or selectedUser._id (for normal chat)
      const receiverId = data.receiverId || selectedUser?._id;

      if (!receiverId) {
        throw new Error("No receiver specified");
      }

      const res = await axiosMessageInstance.post(
        `/sendMessage/${receiverId}`,
        {
          text: data.text || "",
          image: data.image || null,
        }
      );

      // Only update messages if it's for the currently selected user
      if (receiverId === selectedUser?._id) {
        set({ messages: [...messages, res.data] });
      }

      return res.data;
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
      throw error;
    } finally {
      set({ isSendingMessaging: false });
    }
  },

  // Forward message to multiple users
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

      console.log("After forward result", results);

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
      console.error("Forward message error:", error);
      toast.error("Failed to forward message");
      throw error;
    } finally {
      set({ isSendingMessaging: false });
    }
  },

  // NEW: Updated deleteFromBoth function for real-time deletion
  deleteFromBoth: async (messageId) => {
    set({ isDeletingBoth: true });
    try {
      console.log("Deleting message ID:", messageId);
      
      const res = await axiosMessageInstance.delete("/delete-both", {
        data: { messageId }
      });
      
      console.log("Delete response:", res.data);
      
      // Don't update messages here - socket will handle it
      toast.success("Message deleted for everyone");
      
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete message");
      }
    } finally {
      set({ isDeletingBoth: false });
    }
  },
}));
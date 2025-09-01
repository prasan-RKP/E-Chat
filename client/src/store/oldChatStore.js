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
      }
      toast.error("Something went wrong 😴");
    } finally {
      set({ isFetchingMessage: false });
    }
  },

  /*
  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessaging: true });

    try {
      const res = await axiosMessageInstance.post(
        `/sendMessage/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMessaging: false });
    }
  },
  */

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // this line 🍟🍟🍟🍟
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    // listening events for 'DeletedMessages'

    socket.on("messageDeleted", ({ messageId }) => {
      set({ messages: get().messages.filter((msg) => msg._id !== messageId) });
    });
  },

  unSubscribeFromMessages: async () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // 'delete' messages functionality

  removeMessageAction: async (messageData) => {
    set({ isRemovingMessage: true });
    try {
      const res = await axiosMessageInstance.post(
        `/removeMsg/${messageData._id}`
      );
      set({ messages: res.data });
      toast.success("Message deleted successfully");
    } catch (error) {
      if (err.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong 😴");
      }
    } finally {
      set({ isRemovingMessage: false });
    }
  },

  //// This is new Logic that i have added to 'showModal' a new feature forward message (new - Added)
  // here i am trying a new feature for send Message by 'claudde AI'
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

  // Add a new method for forwarding to multiple users
  // If it will not work then i will remove it
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

  // Deleting messages from bothSide

  isDeletingBoth: false,
  deleteFromBoth: async (data) => {
    set({ isDeletingBoth: true });
    try {
      const res = await axiosMessageInstance.delete("/delete-both", data);
      set({ messages: res.data });
      toast.success("Message deleted for everyone");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong 😴");
      }
    } finally {
      set({ isDeletingBoth: false });
    }
  },
}));

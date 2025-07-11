import { create } from "zustand";
import { axiosMessageInstance } from "../lib/axiosMessage.js";
import { toast } from "react-hot-toast";
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

    socket.on('messageDeleted', ({messageId})=> {
      set({messages: get().messages.filter((msg)=> msg._id !== messageId)});
    })

  },

  unSubscribeFromMessages: async () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // 'delete' messages functionality

  removeMessageAction: async (messageData) => {
    set({isRemovingMessage: true});
    try {
      const res = await axiosMessageInstance.post(`/removeMsg/${messageData._id}`)
      set({messages: res.data});
      toast.success('Message deleted successfully');
    } catch (error) {
      if(err.response){
        toast.error(error.response.data.message);
      }
      else{
        toast.error('Something went wrong 😴')
      }
    }

    finally{
      set({isRemovingMessage: false});
    }
    },
}));

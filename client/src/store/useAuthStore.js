import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance.js";
import { toast } from "sonner";
import { axiosPostInstace } from "../lib/axiosPostInstance.js";
import { io } from "socket.io-client";
// import dotenv from "dotenv";
// dotenv.config();

const BASE_URL = "https://chat-io-bjln.onrender.com";
//const BASE_URL = "http://localhost:5008";
//const BASE_URL = "http://192.168.29.238:5008";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isProfileUploading: false,
  uploadingPost: false,
  fetchingPosts: false,
  socket: null,
  onlineUsers: [],
  isLikingPost: false,

  showPost: async () => {},

  fetchingPosts: async () => {},

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/check");
      set((state) => ({
        authUser: { ...state.authUser, ...res.data },
      }));
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log(error.response?.data?.message || "Something went wrong.");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateProfile: async (data) => {
    set({ isProfileUploading: true });
    try {
      const res = await axiosInstance.put("/profile", data);
      set({ authUser: res.data });
      toast.success("profile updated successfully ✅");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      set({ isProfileUploading: false });
    }
  },

  signup: async (data) => {
    set({ isSigningIn: true });

    try {
      const res = await axiosInstance.post("/signup", data);
      set({ authUser: res.data });
      toast.success("Congrats 🎊 welcome to chat-IO 🍟💬");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      set({ isSigningIn: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully, welcome Again..");

      setTimeout(() => {
        get().connectSocket();
        get().socket?.emit("userReconnected", res.data._id); // ✅ Explicitly emit
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (navigate) => {
    try {
      const { authUser, socket } = get();

      if (socket) {
        socket.emit("userDisconnected", authUser?._id);
        socket.disconnect(); // Ensure disconnection
        set({ socket: null });
      }

      await axiosInstance.post("/logout");
      set({ authUser: null, onlineUsers: [] }); // Clear online users list
      if (navigate) {
        navigate("/");
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  },

  // connect socket code here

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
      autoConnect: false,
      reconnection: true,
      forceNew: true,
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      // console.log("Updated Online Users:", userIds); // ✅ Debugging
      set({ onlineUsers: userIds });
    });

    newSocket.on("forceDisconnect", () => {
      newSocket.disconnect();
      set({ socket: null });
    });

    newSocket.emit("userReconnected", authUser._id); // ✅ Emit after connecting
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },

  isFetchingChartData: false,
  chartData: null,
  fetchChartData: async () => {
    set({ isFetchingChartData: true });
    try {
      const res = await axiosInstance.get("/fetch-chart");
      set({ chartData: res.data });
      setTimeout(() => {
        toast.info("Tip: Tilt or rotate your Phone to have a great Experience");
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Try Again, Something Went Wrong");
      }
    } finally {
      set({ isFetchingChartData: false });
    }
  },

  isFollowing: false,
  followFeature: async (data) => {
    set({ isFollowing: true });
    try {
      const res = await axiosInstance.patch("/follow", data);

      // Update both authUser and visitUserValue if needed
      // set((state) => ({
      //   authUser: res.data.user,
      //   visitUserValue:
      //     state.visitUserValue?._id === data.fid
      //       ? { ...state.visitUserValue, followers: res.data.user.followers }
      //       : state.visitUserValue,
      // }));

      set(() => ({
        authUser: res.data.user,
        visitUserValue: res.data.targetUser, // ✅ always updated
      }));

      if (res.data?.action === "followed") {
        toast.success("User Followed ✅");
      } else {
        toast.success("User Unfollowed ❌");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Try Again, Something Went Wrong");
      }
    } finally {
      set({ isFollowing: false });
    }
  },

  // visit user logic
  isVisitingUser: false,
  visitUserValue: null,
  visitUser: async ({ userId }) => {
    set({ isVisitingUser: true, visitUserValue: null });
    try {
      const res = await axiosInstance.get(`/visit-user/${userId}`);
      set({ visitUserValue: res.data });
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Try Again, Something Went Wrong");
      }
    } finally {
      set({ isVisitingUser: false });
    }
  },

  isAddingFullBio: false,
  addFullBio: async (data) => {
    set({ isAddingFullBio: true });
    try {
      const res = await axiosInstance.patch("/add-full-bio", data);
      set({ authUser: res.data });
      toast.success("Bio updated successfully ✅");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong Please try Again..!");
      }
    } finally {
      set({ isAddingFullBio: false });
    }
  },
}));

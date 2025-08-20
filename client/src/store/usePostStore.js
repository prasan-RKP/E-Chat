import { create } from "zustand";
import { axiosPostInstace } from "../lib/axiosPostInstance";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const usePostStore = create((set, get) => ({
  authPost: null,
  uploadingPost: false,
  fetchingPosts: false,

  addPost: async (data, navigate) => {
    set({ uploadingPost: true });
    try {
      const res = await axiosPostInstace.post("/add-post", data);
      set({ authPost: res.data });
      toast.success("Post uploaded successfully");
      // navigate("/allposts");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong Please try Again..!");
      }
    } finally {
      set({ uploadingPost: false });
    }
  },

  //

  showPost: async () => {
    set({ fetchingPosts: true });

    try {
      const res = await axiosPostInstace.get("/allposts");
      //useAuthStore.setState({ authUser: res.data });
      set({ authPost: res.data });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong...😟");
      }
    } finally {
      set({ fetchingPosts: false });
    }
  },

  isDeletingPost: false,
  deletePost: async (data) => {
    set({ isDeletingPost: true });
    try {
      const res = await axiosPostInstace.delete("/delete-post", {data});
      set({ authPost: res.data });
      toast.success("Post deleted successfully ✅");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong...😟");
      }
    } finally {
      set({ isDeletingPost: false });
    }
  },
}));

import { create } from "zustand";
import { axiosPostInstace } from "../lib/axiosPostInstance";
import { toast } from "sonner";
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
      const res = await axiosPostInstace.delete("/delete-post", { data });
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

  // Re-correcting the 'addLikePost() ' feature

  isLikingPost: false,
  addLike: async (data) => {
    set({ isLikingPost: true });
    try {
      const res = await axiosPostInstace.patch("/likePost", data);

      const updatedPost = res.data.post; // ✅ extract actual post
      const action = res.data.action;

      // ✅ Update only the specific post inside authPost (array)
      set((state) => ({
        authPost: state.authPost.map((p) =>
          p._id === updatedPost._id ? updatedPost : p
        ),
      }));

      if (action === "unliked") {
        toast.info("Post Unliked 💔");
      } else {
        toast.success("Post Liked ❤️");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Try Again, Something went wrong");
      }
    } finally {
      set({ isLikingPost: false });
    }
  },
}));

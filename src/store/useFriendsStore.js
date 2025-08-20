import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFriendsStore = create((set, get) => ({
  friends: [],
  searchResults: [],
  isFriendsLoading: false,
  onlineFriends: [],
  setOnlineFriends: (userIds) => set({ onlineFriends: userIds }),
  searchFriend: async (handle) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/friends/${handle}`);
      set({ searchResults: res.data });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to search friend");
    } finally {
      set({ loading: false });
    }
  },

  sendFriendRequest: async (recipientId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post(`/friends/send/${recipientId}`);
      toast.success("Friend request sent ✅");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request");
    } finally {
      set({ loading: false });
    }
  },

  acceptFriendRequest: async (requesterId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(`/friends/accept/${requesterId}`);
      toast.success("Friend request accepted ✅");
      // بعد القبول، ممكن نعمل refresh لقائمة الأصدقاء
      await get().fetchFriends();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to accept request");
    } finally {
      set({ loading: false });
    }
  },

  rejectFriendRequest: async (requesterId) => {
    set({ loading: true });
    try {
      await axiosInstance.post(`/friends/reject/${requesterId}`);
      toast.success("Friend request rejected ❌");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject request");
    } finally {
      set({ loading: false });
    }
  },

  getFriends: async () => {
        set({ isFriendsLoading: true });
        try {
            const res = await axiosInstance.get('messages/friends/');
            set({ friends: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFriendsLoading: false });
        }
    },
}));

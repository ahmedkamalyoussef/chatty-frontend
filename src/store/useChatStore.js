import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    isMessagesLoading: false,
    friends: [],
    selectedFriend: null,
    isFriendsLoading: false,

    getFriends: async () => {
        set({ isFriendsLoading: true });
        try {
            const res = await axiosInstance.get('/messages/friends');
            set({ friends: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFriendsLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data, selectedUser: userId });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { messages, selectedFriend } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedFriend._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    setSelectedFriend: (user) => {
        set({ selectedFriend: user });
        console.log("Selected friend set to:", user);
        console.log("Selected friend :", get().selectedFriend);

    },
    subscribeToMessages: () => { 
        const selectedFriend = get().selectedFriend;
        if (!selectedFriend) return;
        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            if(newMessage.senderId !== selectedFriend._id) return;
            set(() => ({
                messages: [...get().messages, newMessage]
            }));
        }
)},
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
     },
}));
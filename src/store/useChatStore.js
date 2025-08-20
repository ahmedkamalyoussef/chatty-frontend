import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    isMessagesLoading: false,
    selectedFriend: null,

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data, selectedUser: userId });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { messages, selectedFriend } = get();
        if (!selectedFriend) return;

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedFriend._id}`, 
                messageData
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    setSelectedFriend: (user) => {
        set({ selectedFriend: user });
    },

    subscribeToMessages: () => {
        const selectedFriend = get().selectedFriend;
        if (!selectedFriend) return;

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId === selectedFriend._id) {
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off('newMessage');
    }
}));
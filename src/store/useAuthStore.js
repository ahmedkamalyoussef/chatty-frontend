import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data })
        } catch {
            // console.log("err in check",error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("auth/signup", data);
            set({ authUser: res.data });
            toast.success("account created successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("auth/logout");
            set({ authUser: null });
            toast.success("loged out successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } 
    },
    login: async (data) => {
        set({ isLogingIn: true });
        try {
            const res = await axiosInstance.post("auth/login", data);
            set({ authUser: res.data });
            // toast.success("loged in successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLogingIn: false })
        }
    },
}))
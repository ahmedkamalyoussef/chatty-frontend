import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfilePic: false,
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
    signup: async (data, navigate) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("auth/signup", data);
            set({ authUser: res.data });
            toast.success("account created successfully");
            if (navigate) navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },
    logout: async (navigate) => {
        try {
            await axiosInstance.post("auth/logout");
            set({ authUser: null });
            toast.success("loged out successfully");
            if (navigate) navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data, navigate, location) => {
        set({ isLogingIn: true });
        try {
            const res = await axiosInstance.post("auth/login", data);
            set({ authUser: res.data });
            // toast.success("loged in successfully");
            if (navigate && location && location.pathname === '/login') navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLogingIn: false })
        }
    },
    updateProfilePic: async (data) => {
        set({ isUpdatingProfilePic: true });
        try {
            const res = await axiosInstance.patch("auth/update-profile-pic", data);
            set({ authUser: res.data });
            toast.success("profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfilePic: false })
        }
    },
}))
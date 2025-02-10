import { toast } from "@/hooks/use-toast";
import { axiosUserInstance } from "../lib/axios";
import { create } from "zustand";

type AuthStore = {
    authUser: any;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<any>;
    login: (data: any) => Promise<any>;
    signUp: (data: any) => Promise<any>;
    logout: () => Promise<any>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const response = await axiosUserInstance.get("/auth/check");
            set({ authUser: response.data.user });
        } catch (error) {
            console.log("Error checking auth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosUserInstance.post("/auth/login", data);
            set({ authUser: response.data });
            toast({
				variant: "success",
				description: `${response.data.name}, you have successfully logged in!`,
			});
        } catch (error : any) {   
            console.log("Error logging in:", error);
            toast({
                variant: "destructive",
                description: error.response.data.message
            });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosUserInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast({
				variant: "success",
				description: `${response.data.name}, you have successfully signed up!`,
			});
        } catch (error : any) {
            console.log("Error signing up:", error);
            toast({
                variant: "destructive",
                description: error.response.data.message
            });
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosUserInstance.post("/auth/logout");
            set({ authUser: null });
            toast({
                variant: "success",
                description: "Logged out successfully."
            });
        } catch (error : any) {
            console.log("Error logging out:", error);
            toast({
                variant: "destructive",
                description: error.response.data.message
            });
        }
    }
}));
import { create } from "zustand";
import { type PublicUser } from "@backend/db/schema/user";

const API_URL = "http://localhost:3002/api/auth";

type AuthActions = {
    register: (email: string, password: string, name: string) => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    checkAuth: (userId: string) => Promise<void>;
}

type AuthState = {
    user: PublicUser | null;
    isAuthenticated: boolean;
    error: string | null;
    message: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    actions: AuthActions;
}

type Method = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

const authFetch = async <T>(endpoint: string, body?: object, method: Method = "POST", headers?: Record<string, string>) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        credentials: "include", // include cookies in the request
        body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Authentication error");
    }
    return response.json() as Promise<T>;
}

export const useAuthStore = create<AuthState>()((set) => {
    const withLoading = async (fn: () => Promise<void>) => {
        set({ isLoading: true, error: null });
        try {
            await fn();
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }

    return {
        user: null,
        isAuthenticated: false,
        error: null,
        message: null,
        isLoading: false,
        isCheckingAuth: true,

        actions: {
            register: async (email: string, password: string, name: string) => {
                await withLoading(async () => {
                    const { user } = await authFetch<{ user: PublicUser }>("register", { email, password, name });
                    set({ user })
                });
            },

            verifyEmail: async (verificationCode: string) => {
                await withLoading(async () => {
                    const { user } = await authFetch<{ user: PublicUser }>("verify-email", { verificationCode });
                    set({ user, isAuthenticated: true });
                });
            },

            login: async (email: string, password: string) => {
                await withLoading(async () => {
                    const { user } = await authFetch<{ user: PublicUser }>("login", { email, password });
                    set({ user, isAuthenticated: true });
                });
            },

            logout: async () => {
                await withLoading(async () => {
                    await authFetch<void>("logout", {}, "DELETE");
                    set({ user: null, isAuthenticated: false });
                });
            },

            forgotPassword: async (email: string) => {
                await withLoading(async () => {
                    const { message } = await authFetch<{ message: string }>("forgot-password", { email }, "POST");
                    set({ message });
                });
            },

            resetPassword: async (token: string, newPassword: string) => {
                await withLoading(async () => {
                    const { message } = await authFetch<{ message: string }>(`reset-password/${token}`, { token, password: newPassword });
                    set({ message });
                });
            },

            checkAuth: async (userId: string) => {
                await withLoading(async () => {
                    const { user } = await authFetch<{ user: PublicUser }>(`check-auth/${userId}`, {}, "GET");
                    set({ user, isAuthenticated: true });
                });
            }
        }
    }
});

export const useAuthActions = () => {
    return useAuthStore((state) => state.actions);
}
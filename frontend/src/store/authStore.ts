import { create } from "zustand";
import { type PublicUser } from "@backend/db/schema/user";

const API_URL = "http://localhost:3002/api/auth";

type AuthActions = {
    register: (email: string, password: string, name: string) => Promise<string>;
    verifyEmail: (code: string) => Promise<string>;
    login: (email: string, password: string) => Promise<string>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<string>;
    resetPassword: (token: string, newPassword: string) => Promise<string>;
    checkAuth: () => Promise<void>;
};

type AuthState = {
    user: PublicUser | null;
    isAuthenticated: boolean;
    error: string | null;
    message: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    actions: AuthActions;
};

type Method = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

const authFetch = async <T>(
    endpoint: string,
    body?: object,
    method: Method = "POST",
    headers?: Record<string, string>,
): Promise<T> => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Authentication error");
    }

    return response.json() as Promise<T>;
};

export const useAuthStore = create<AuthState>()((set) => {
    const withLoading = async <T>(fn: () => Promise<T>) => {
        set({ isLoading: true, error: null });
        try {
            return fn();
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    };

    return {
        user: null,
        isAuthenticated: false,
        error: null,
        message: null,
        isLoading: false,
        isCheckingAuth: true,

        actions: {
            register: async (email, password, name) => {
                return withLoading(async () => {
                    const { data: user, message } = await authFetch<{ data: PublicUser, message: string }>("register", { email, password, name });
                    set({ user, isAuthenticated: false, message });
                    return message;
                });
            },

            verifyEmail: async (verificationCode) => {
                return withLoading(async () => {
                    const { message } = await authFetch<{ message: string }>("verify-email", { verificationCode });
                    set({ message, isAuthenticated: false });
                    return message;
                });
            },

            login: async (email, password) => {
                return withLoading(async () => {
                    const { data: user, message } = await authFetch<{ data: PublicUser, message: string }>("login", { email, password });
                    set({ user, isAuthenticated: true, message });

                    return message;
                });
            },

            logout: async () => {
                return withLoading(async () => {
                    await authFetch<{ message: string }>("logout", {}, "DELETE");
                    set({ user: null, isAuthenticated: false });
                });
            },

            forgotPassword: async (email) => {
                return withLoading(async () => {
                    const { message } = await authFetch<{ message: string }>("forgot-password", { email });
                    set({ message });
                    return message;
                });
            },

            resetPassword: async (token, newPassword) => {
                return withLoading(async () => {
                    const { message } = await authFetch<{ message: string }>(`reset-password/${token}`, { password: newPassword });
                    set({ message });
                    return message;
                });
            },

            checkAuth: async () => {
                set({ isCheckingAuth: true });
                try {
                    const { data } = await authFetch<{ data: PublicUser }>("check-auth", undefined, "GET");
                    set({ user: data, isAuthenticated: true });
                } catch (error) {
                    set({ user: null, message: (error as Error).message, isAuthenticated: false });
                } finally {
                    set({ isCheckingAuth: false });
                }
            },
        },
    };
});

export const useAuthActions = () => useAuthStore((state) => state.actions);
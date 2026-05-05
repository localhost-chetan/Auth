import { create } from "zustand";

const API_URL = "http://localhost:3002/api/auth";

type AuthActions = {
    register: (email: string, password: string, name: string) => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
}

type AuthState = {
    user: any | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    actions: AuthActions;
}

const authFetch = async (endpoint: string, body?: object, headers?: Record<string, string>) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: body ? "POST" : "GET",
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
    return response.json();
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
        isLoading: false,
        isCheckingAuth: true,

        actions: {
            register: async (email: string, password: string, name: string) => {
                await withLoading(async () => {
                    const user = await authFetch("register", { email, password, name });
                    set({ user })
                });
            },

            verifyEmail: async (verificationCode: string) => {
                await withLoading(async () => {
                    const user = await authFetch("verify-email", { verificationCode });
                    set({ user, isAuthenticated: true });
                });
            },

            login: async (email: string, password: string) => {
                await withLoading(async () => {
                    const user = await authFetch("login", { email, password });
                    set({ user, isAuthenticated: true });
                });
            }
        }
    }
})

export const useAuthActions = () => {
    return useAuthStore((state) => state.actions);
}
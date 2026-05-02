import { create } from "zustand";

const API_URL = "http://localhost:3002/api/auth";

type AuthActions = {
    register: (email: string, password: string, name: string) => Promise<void>;
}

type AuthState = {
    user: any | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    actions: AuthActions;
}

export const useAuthStore = create<AuthState>()((set) => {
    return {
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: true,

        actions: {
            register: async (email: string, password: string, name: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${API_URL}/register`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password, name })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to register.");
                    }
                    const user = await response.json();
                    set(() => ({ isLoading: false, user }));
                } catch (error) {
                    set(() => ({ isLoading: false, error: (error as Error).message }));
                    throw error;
                }
            }
        }
    }
})


export const useAuthActions = () => {
    return useAuthStore((state) => state.actions);
}
'use client'

import { useEffect } from "react"
import { Spinner } from "@components/spinner"
import { useAuthActions, useAuthStore } from "@/store/authStore"

export const SessionRestore = () => {
    const { checkAuth } = useAuthActions()
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        const checkingAuth = async () => {
            if (!user) {
                await checkAuth()
            }
        }
        checkingAuth()
    }, [user, checkAuth])

    if (isCheckingAuth && !user) {
        return (
            <div className="flex items-center justify-center gap-2">
                <Spinner />
                <span>Getting your session...</span>
            </div>
        );
    }

    return null;
}
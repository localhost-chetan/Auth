'use client'

import { useAuthActions } from "@/store/authStore"
import { Button } from "@shadcn/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const Logout = () => {
    const { logout } = useAuthActions()

    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
        toast.success("Logged out successfully")
    }

    return (
        <Button variant={"default"} onClick={handleLogout}>Logout</Button>
    )
}
'use client'

import { cn } from "@lib/utils"
import { useAuthActions } from "@/store/authStore"
import { Button } from "@shadcn/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type LogoutProps = {
    className?: string;
}

export const Logout = ({ className }: LogoutProps) => {
    const { logout } = useAuthActions()

    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push("/login")
        toast.success("Logged out successfully")
    }

    return (
        <Button variant={"default"} onClick={handleLogout} className={cn(className)}>Logout</Button>
    )
}
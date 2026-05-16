'use client';

import { useAuthStore } from "@/store/authStore";
import { Logout } from "@components/logout";
import { FormWrapper } from "@components/form-wrapper";
import { FormTitle } from "@components/form-title";
import { Wrapper } from "@components/wrapper";
import { Mail, User, Calendar, Clock, Shield } from "lucide-react";
import { type ComponentType } from "react";
import { formatDate, formatTime } from "@lib/utils";


type InfoItemProps = {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string | null | undefined;
    secondary?: string;
};

const InfoItem = ({ icon: Icon, label, value, secondary }: InfoItemProps) => (
    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 backdrop-blur-sm">
        <Icon className="size-5 text-green-400" />

        <div className="flex flex-col gap-y-3.5">
            <p className="text-xs">{label}</p>
            <p className="text-sm font-medium text-secondary">{value ?? "N/A"}</p>
            {secondary && <p className="text-xs text-muted-foreground">{secondary}</p>}
        </div>
    </div>
);


export const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <Wrapper>
            <FormWrapper>
                <div className="p-2 sm:p-4 md:p-6 lg:p-8">
                    <FormTitle title="Dashboard" />

                    <div className="mt-6 space-y-4 text-primary-foreground">
                        <InfoItem icon={User} label="Name" value={user?.name} />
                        <InfoItem icon={Mail} label="Email" value={user?.email} />
                        <InfoItem icon={Shield} label="Verified" value={user?.isVerified ? "Yes" : "No"} />
                        <InfoItem icon={Clock} label="Last Login" value={formatDate(user?.lastLogin)} secondary={formatTime(user?.lastLogin)} />
                        <InfoItem icon={Calendar} label="Member Since" value={formatDate(user?.createdAt)} />
                    </div>

                    <div className="mt-4">
                        <Logout className="w-full py-5" />
                    </div>
                </div>
            </FormWrapper>
        </Wrapper>
    );
}

import { DashboardPage } from "@components/dashboard-page";
import { ProtectedLayout } from "@components/protected-layout";

export default function Page() {
    return (
        <ProtectedLayout>
            <DashboardPage />
        </ProtectedLayout>
    );
}
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { useAuthStore } from "@/store/useAuthStore";

const DashboardPage = () => {
    const { authUser } = useAuthStore();

    return (
        <SidebarProvider>
            <DashboardSidebar/>
            <main className="flex flex-col flex-1">
                <SidebarTrigger className="size-10"/>
                <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                    Welcome {authUser.name}
                </div>
            </main>
        </SidebarProvider>
    );
}

export default DashboardPage;
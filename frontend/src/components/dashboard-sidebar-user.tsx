import { useAuthStore } from "@/store/useAuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, 
    useSidebar
} from "./ui/sidebar";
import { ChevronsUpDown, LogOut } from "lucide-react";


const SidebarUser = () => {
    const { isMobile } = useSidebar()
    const { authUser: user, logout } = useAuthStore();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            {/*<div className="h-8 w-8 rounded-lg"></div>*/}
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}>

                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                {/*<div className="h-8 w-8 rounded-lg"></div>*/}
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        {/* <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            { <DropdownMenuItem asChild>
                                <a href="/dashboard">
                                    <BadgeCheck />
                                    Account
                                </a>
                            </DropdownMenuItem> 

                             <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem> 
                        </DropdownMenuGroup> */}

                        <DropdownMenuSeparator />
                            
                        <DropdownMenuItem asChild>
                            <SidebarMenuButton onClick={logout}>
                                <LogOut />
                                Log out
                            </SidebarMenuButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export default SidebarUser;
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import SidebarUser from "./dashboard-sidebar-user";
import SidebarMedia from "./dashboard-sidebar-media";
import { LayoutDashboard, TrendingUp } from "lucide-react";
import SidebarTracked from "./dashboard-sidebar-tracked";

const DashboardSidebar = () => {
return (
	<Sidebar variant="sidebar" collapsible="icon" side="left">
		<SidebarHeader className="flex items-center justify-between p-2">
			<LayoutDashboard />
		</SidebarHeader>

		<SidebarContent>
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip={"Trending Movies, TV Shows and Games in the last 24 hours"}>
							<a href="/dashboard/trending">
								<TrendingUp />
								<span>Trending</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>

			<SidebarMedia/>

			<SidebarTracked/>
		</SidebarContent>
		
		<SidebarFooter>
			<SidebarUser />
		</SidebarFooter>
	</Sidebar>
)}

export default DashboardSidebar;
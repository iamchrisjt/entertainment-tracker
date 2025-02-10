import { Film, Gamepad2, TvMinimal } from "lucide-react";
import { 
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "./ui/sidebar";

const trackedData = [
    {
        name: "Movies",
        icon: <Film />,
        link: "/dashboard/movies/tracked",
    },
    {
        name: "TV Shows",
        icon: <TvMinimal />,
        link: "/dashboard/tv-shows/tracked",
    },
    {
        name: "Games",
        icon: <Gamepad2 />,
        link: "/dashboard/games/tracked",
    }
];

const SidebarTracked = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Tracked</SidebarGroupLabel>
            <SidebarMenu>
            {trackedData.map(track => {
                return <SidebarMenuItem key={"track-" + track.name}>
                            <SidebarMenuButton tooltip={track.name} asChild>
                                <a href={track.link}>
                                    {track.icon}
                                    <span>{track.name}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
            })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export default SidebarTracked;
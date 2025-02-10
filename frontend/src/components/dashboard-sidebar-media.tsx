import { ChevronRight, Film, Gamepad2, TvMinimal } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "./ui/collapsible";
import { 
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from "./ui/sidebar";

const mediaData = [
    {
        name: "Movies",
        icon: <Film />,
        isOpen: true,
        menuItems: [
            {
                name: "Popular",
                link: "/dashboard/movies/popular"
            },
            {
                name: "Upcoming",
                link: "/dashboard/movies/upcoming"
            },
            {
                name: "Top Rated",
                link: "/dashboard/movies/top-rated"
            },
            {
                name: "Search",
                link: "/dashboard/movies/search"
            },
        ],
    },
    {
        name: "TV Shows",
        icon: <TvMinimal />,
        isOpen: true,
        menuItems: [
            {
                name: "Popular",
                link: "/dashboard/tv-shows/popular"
            },
            {
                name: "Airing Today",
                link: "/dashboard/tv-shows/airing-today"
            },
            {
                name: "On The Air",
                link: "/dashboard/tv-shows/on-the-air"
            },
            {
                name: "Top Rated",
                link: "/dashboard/tv-shows/top-rated"
            },
            {
                name: "Search",
                link: "/dashboard/tv-shows/search"
            },
        ]
    },
    {
        name: "Games",
        icon: <Gamepad2 />,
        isOpen: true,
        menuItems: [
            {
                name: "24hr Peak Players",
                link: "/dashboard/games/24hr-peak-players"
            },
            {
                name: "Positive Reviews",
                link: "/dashboard/games/positive-reviews"
            },
            {
                name: "Search",
                link: "/dashboard/games/search"
            },
        ]
    }
];

const SidebarMedia = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Media</SidebarGroupLabel>
            <SidebarMenu>
            {mediaData.map(media => {
                return <Collapsible
                    key={media.name}
                    asChild
                    defaultOpen={media.isOpen}
                    className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={media.name}>
                                    {media.icon}
                                    <span>{media.name}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
    
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                {media.menuItems.map(menuItem => {
                                    return <SidebarMenuSubItem key={menuItem.name}>
                                        <SidebarMenuSubButton asChild>
                                            <a href={menuItem.link}>
                                                <span>{menuItem.name}</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                })}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
            })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export default SidebarMedia;
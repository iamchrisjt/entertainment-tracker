import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { useEffect, useState } from "react";
import ViewItems from "@/components/view-items-list";
import { CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ViewTrackedItemsPageProps {
    pageTitle?: string;

    changeSearchQuery?: (query: string) => void;

    searchItemList?: any[];
    fetchSearchItemList: () => Promise<any>;
    fetchingSearchItemList?: boolean;

    itemDisplayComponent?: any;
    
    itemSearchPageNumber?: number;
    maxSearchPageNumber?: number;
    changeSearchPage?: (page: number) => Promise<any>;
    itemPreviousSearchPage?: () => Promise<any>;
    itemNextSearchPage?: () => Promise<any>;
}

const ViewTrackedItemsPage : React.FC<ViewTrackedItemsPageProps> = (props) => {
    const {
        pageTitle,
        changeSearchQuery,
        searchItemList: itemList,
        fetchSearchItemList: fetchItemList,
        fetchingSearchItemList: fetchingItemList,
        itemDisplayComponent,
        itemSearchPageNumber: itemPageNumber,
        maxSearchPageNumber: maxPageNumber,
        changeSearchPage: changePage,
        itemPreviousSearchPage: itemPreviousPage,
        itemNextSearchPage: itemNextPage,
    } = props;
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearch = async () => {
        if (changeSearchQuery) {
            await changeSearchQuery(searchQuery);
        }
    }

    useEffect(() => {
        const fetchItems = async () => {
            await fetchItemList();
        };
        fetchItems();
    }, []);

    return (
        <SidebarProvider>
                <DashboardSidebar/>
                <main className="flex flex-col flex-1">
                    <SidebarTrigger className="size-10"/>

                    <div className="container mx-auto p-6 max-w-7xl">
                        <div className="flex flex-col justify-center items-center w-full">
                            <h1 className="text-3xl font-bold w-full">{pageTitle}</h1>
                            <div className="flex flex-row justify-center items-center w-full mt-4">
                                <Input
                                placeholder={pageTitle}
                                className="w-3/4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                />
                                <Button variant="search" className="mt-2 w-1/4" onClick={() => handleSearch()}>
                                    <CornerDownLeft />
                                </Button>
                            </div>
                        </div>
                        <ViewItems
                            itemList={itemList}
                            fetchItemList={fetchItemList}
                            fetchingItemList={fetchingItemList}
                            itemDisplayComponent={itemDisplayComponent}
                            itemPageNumber={itemPageNumber}
                            itemPreviousPage={itemPreviousPage}
                            itemNextPage={itemNextPage}
                            maxPageNumber={maxPageNumber}
                            changePage={changePage}
                        />
                    </div>
            </main>
        </SidebarProvider>
    )
};

export default ViewTrackedItemsPage;
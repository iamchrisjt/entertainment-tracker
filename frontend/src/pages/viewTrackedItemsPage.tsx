import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { useEffect } from "react";
import ViewItems from "@/components/view-items-list";

interface ViewTrackedItemsPageProps {
    pageTitle?: string;

    itemList?: any[];
    fetchItemList: () => Promise<any>;
    fetchingItemList?: boolean;

    itemDisplayComponent?: any;
    
    itemPageNumber?: number;
    maxPageNumber?: number;
    changePage?: (page: number) => Promise<any>;
    itemPreviousPage?: () => Promise<any>;
    itemNextPage?: () => Promise<any>;
}

const ViewTrackedItemsPage : React.FC<ViewTrackedItemsPageProps> = (props) => {
    const {
        pageTitle,
        itemList,
        fetchItemList,
        fetchingItemList,
        itemDisplayComponent,
        itemPageNumber,
        maxPageNumber,
        changePage,
        itemPreviousPage,
        itemNextPage,
    } = props;

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
                        <div className="flex justify-center items-center mb-6">
                            <h1 className="text-3xl font-bold">{pageTitle}</h1>
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
import { Loader } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";

interface ViewItemsProps {
    itemList?: any[];
    fetchItemList?: () => Promise<any>;
    fetchingItemList?: boolean;

    itemDisplayComponent?: any;
    
    itemPageNumber?: number;
    maxPageNumber?: number;
    changePage?: (page: number) => Promise<any>;
    itemPreviousPage?: () => Promise<any>;
    itemNextPage?: () => Promise<any>;
}

const ViewItems : React.FC<ViewItemsProps> = (props) => {
    const [editingPage, setEditingPage] = useState<string>("1");

    if (props.itemList === undefined || props.fetchItemList === undefined) {
        props.itemList = [];
    }

    const handleChangePage = async () => {
        try {
            if (props.changePage && editingPage !== undefined) {
                await props.changePage(parseInt(editingPage));
            }
            setEditingPage("1");
        } catch (error) {
            console.log("Error changing page:", error);
        }
    }

    return (
        <div>
        { props.fetchingItemList && props.itemList.length === 0 ? (
            <div className="flex justify-center items-center">
                <Loader className="size-10 animate-spin"/>
            </div>
        ) : (
            <div className="w-full">
                <div className="flex flex-col items-center justify-center">
                    <Pagination className="mb-4">
                        <PaginationContent>
                        <PaginationItem>
                                <PaginationPrevious onClick={props.itemPreviousPage}/>
                            </PaginationItem>
                            <PaginationItem>
                                <Popover>
                                    <PopoverTrigger>
                                        <PaginationLink>{props.itemPageNumber}</PaginationLink>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex flex-col w-full">
                                        <Input
                                            type="number"
                                            placeholder="Enter page number"
                                            className="w-full"
                                            min={1}
                                            max={props.maxPageNumber}
                                            value={editingPage}
                                            onChange={(e) => setEditingPage(e.target.value)}
                                        />
                                        <Button className="mt-2" onClick={handleChangePage}> Change Page </Button>
                                    </PopoverContent>
                                </Popover>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext onClick={props.itemNextPage}/>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* Item list */}
                    <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
                        {props.itemList.map(item => {
                            return <props.itemDisplayComponent key={item.id} {...item}/>
                        })}
                    </div>

                    <Pagination className="mb-4">
                        <PaginationContent>
                        <PaginationItem>
                                <PaginationPrevious onClick={props.itemPreviousPage}/>
                            </PaginationItem>
                            <PaginationItem>
                                <Popover>
                                    <PopoverTrigger>
                                        <PaginationLink>{props.itemPageNumber}</PaginationLink>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex flex-col w-full">
                                        <Input
                                            type="number"
                                            placeholder="Enter page number"
                                            className="w-full"
                                            min={1}
                                            max={props.maxPageNumber}
                                            value={editingPage}
                                            onChange={(e) => setEditingPage(e.target.value)}
                                        />
                                        <Button className="mt-2" onClick={handleChangePage}> Change Page </Button>
                                    </PopoverContent>
                                </Popover>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext onClick={props.itemNextPage}/>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        )}
        </div>
    );
};

export default ViewItems;
import DashboardSidebar from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

import { useTvShowStore, useTrackedTvShowStore } from "@/store/useTvShowStore";

import { Check, Loader, Pencil, Plus, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const tvShowSchema = z.object({
    status: z.enum(["plan to watch", "watching", "completed", "dropped"]),
    rating: z.string().min(0).max(10),
    notes: z.string()
});

type TvShowDetailsFormFields = z.infer<typeof tvShowSchema>;

const TvShowDetailsPage = () => {

    const { 
        tvShowDetails, 
        getTvShowDetails, 
        fetchingTvShowDetails 
    } = useTvShowStore();


    const { 
        checkTracking, 
        getTvShowDetails: getTrackedTvShowDetails, 
        fetchingTvShowDetails: trackingFetching, 
        addTvShow, 
        updateTvShow, 
        deleteTvShow 
    } = useTrackedTvShowStore();
    const [tracking, setTracking] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [userTvShowDetails, setUserTvShowDetails] = useState<any>({});

    const navigate = useNavigate();
    const unavailablePoster = "https://placehold.co/200x300";
    const { tvShowID } = useParams();

    const {
        control: tvShowControl,
        register: tvShowRegister,
        handleSubmit: handleTvShowSubmit,
        setError: setTvShowErrors,
        reset: tvShowReset,
        formState: { errors: tvShowErrors, isSubmitting: tvShowIsSubmitting }
    } = useForm<TvShowDetailsFormFields>({
        resolver: zodResolver(tvShowSchema),
        defaultValues: {
            status: "plan to watch",
            rating: "0",
            notes: ""
        }
    });


    const onTvShowSubmit: SubmitHandler<TvShowDetailsFormFields> = async (data) => {
        if (!tvShowID) { navigate("/dashboard/trending"); return; }
        try {
            if (parseInt(data.rating) < 0 || parseInt(data.rating) > 10) {
                setTvShowErrors("rating", { message: "Rating must be between 0 and 10." });
                return;
            }
            const response = await updateTvShow(tvShowID?.toString(), data);
            setUserTvShowDetails(response.tvShow);
            setEditing(false);
        } catch (error) {
            console.log("Error updating tv show:", error);
        }
    }

    const handleAddTvShow = async () => {
        tvShowReset();
        if (!tvShowID) { navigate("/dashboard/trending"); return; }
        try {
            const response = await addTvShow(tvShowID?.toString());
            setUserTvShowDetails(response.tvShow);
            setTracking(true);
        } catch (error) {
            console.log("Error tracking tv show:", error);
            setTracking(false);
        }
    }

    const handleDeleteTvShow = async () => {
        tvShowReset();
        if (!tvShowID) { navigate("/dashboard/trending"); return; }
        try {
            await deleteTvShow(tvShowID?.toString());
            setTracking(false);
            setUserTvShowDetails({});
        } catch (error) {
            console.log("Error tracking tv show:", error);
            setTracking(true);
        }
    }

    useEffect(() => {
        const onStartFetchingTvShowDetails = async () => {
            if (!tvShowID) { navigate("/dashboard/trending"); return; }
            try {
                await getTvShowDetails(tvShowID?.toString());
            } catch (error) {
                console.log("Error getting tv show details:", error);
                toast({
                    variant: "destructive",
                    description: "Error getting tv show details."
                });
                navigate("/dashboard/trending");
            }

            let tvShowTracked = false;

            try {
                const response = await checkTracking(tvShowID?.toString());
                setTracking(response.tracking);
                tvShowTracked = response.tracking;
            } catch (error) {
                console.log("Error checking tracking:", error);
                setTracking(false);
            }

            if (tvShowTracked) {
                try {
                    const response = await getTrackedTvShowDetails(tvShowID?.toString());
                    setUserTvShowDetails(response.tvShow);
                } catch (error) {
                    console.log("Error getting tracked tv show details:", error);
                }
            }
        }

        onStartFetchingTvShowDetails();
    }, []);

    return (
        <SidebarProvider>
                <DashboardSidebar/>
                <main className="flex flex-col flex-1">
                    <SidebarTrigger className="size-10"/>

                    <div className="container mx-auto p-6 max-w-7xl">
                    { fetchingTvShowDetails ? (
                        <div className="flex justify-center items-center">
                            <Loader className="size-10 animate-spin"/>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center mb-6">
                            <h1 className="text-3xl font-bold">{tvShowDetails.name}</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-center items-center">
                                    <img src={tvShowDetails.poster_path ? "https://image.tmdb.org/t/p/original" + tvShowDetails.poster_path : unavailablePoster} alt={tvShowDetails.name} className="w-full h-full object-cover rounded"/>
                                </div>
                                <div>
                                    <div className="flex flex-col mt-2 text-center font-semibold">
                                        <p>Rating: {Math.round(tvShowDetails.vote_average * 10) / 10}/10</p>
                                        <p>Released: {tvShowDetails.release_date}</p>
                                        <p>Overview: {tvShowDetails.overview}</p>
                                        <p>Genres: {tvShowDetails.genres?.map((genre: { name: string }) => genre.name).join(", ")}</p>
                                    </div>
                                    <div className="mt-20">
                                        { tracking ? (
                                            (!editing) ? (
                                                <>
                                                {trackingFetching ? (
                                                    <Loader className="size-10 animate-spin flex text-center justify-center items-center"/>
                                                ) : (
                                                    <>
                                                        <div className="mt-2 flex flex-col text-center">
                                                            <p>User Status: {userTvShowDetails.status ? userTvShowDetails.status : "Not updated"}</p>
                                                            <p>User Rating: {userTvShowDetails.rating || (userTvShowDetails.rating == 0) ? Math.round(userTvShowDetails.rating * 10) / 10 + "/10" : "Not updated"}</p>
                                                            <p className="mt-2">User Notes</p>
                                                            <p>{userTvShowDetails.notes ? userTvShowDetails.notes : ""}</p>
                                                        </div>
                                                        <Button variant="search" onClick={() => setEditing(true)} className="mt-2 w-1/2">
                                                            <Pencil />
                                                        </Button>
                                                        <Button variant="destructive" onClick={handleDeleteTvShow} className="mt-2 w-1/2">
                                                            <Trash2 />
                                                        </Button>
                                                    </>
                                                )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mt-2 flex flex-col text-center">
                                                        <form onSubmit={handleTvShowSubmit(onTvShowSubmit)} className="space-y-4 pt-4">
                                                            <div className="mt-2 flex flex-col text-center">
                                                                <Label>Status</Label>
                                                                <FormField control={tvShowControl} name="status" render={({ field }) => (
                                                                    <Select 
                                                                    defaultValue={ userTvShowDetails.status ? userTvShowDetails.status : "plan to watch" }
                                                                    onValueChange={field.onChange}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent {...tvShowRegister("status")}>
                                                                            <SelectItem value="plan to watch">Plan to watch</SelectItem>
                                                                            <SelectItem value="watching">Watching</SelectItem>
                                                                            <SelectItem value="completed">Completed</SelectItem>
                                                                            <SelectItem value="dropped">Dropped</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )} />
                                                                {tvShowErrors.status && <p className="text-red-500 text-sm">{tvShowErrors.status.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Label>Rating</Label>
                                                                <Input
                                                                {...tvShowRegister("rating")}
                                                                defaultValue={ userTvShowDetails.rating ? parseInt(userTvShowDetails.rating) : "0" }
                                                                type="number"
                                                                placeholder="Enter your rating"
                                                                className="w-full" /> 
                                                                {tvShowErrors.rating && <p className="text-red-500 text-sm">{tvShowErrors.rating.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Label>Notes</Label>
                                                                <Textarea
                                                                { ...tvShowRegister("notes") }
                                                                defaultValue={ userTvShowDetails.notes ? userTvShowDetails.notes : "" }
                                                                placeholder="Enter your notes"
                                                                className="w-full" />
                                                                {tvShowErrors.notes && <p className="text-red-500 text-sm">{tvShowErrors.notes.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Button variant="success" disabled={tvShowIsSubmitting} type="submit" className="mt-2 w-1/2">
                                                                    <Check />
                                                                </Button>
                                                                <Button variant="destructive" onClick={() => setEditing(false)} className="mt-2 w-1/2">
                                                                    <X />
                                                                </Button>
                                                            </div>

                                                            {tvShowErrors.root && <p className="text-red-500 text-sm">{tvShowErrors.root.message}</p>}
                                                        </form>
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            <Button variant="success" onClick={handleAddTvShow} className="mt-2 w-full">
                                                <Plus />
                                            </Button>        
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
            </main>
        </SidebarProvider>
    );
}

export default TvShowDetailsPage;
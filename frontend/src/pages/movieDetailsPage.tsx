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

import { useMovieStore } from "@/store/useMovieStore";
import { useTrackedMovieStore } from "@/store/useMovieStore";

import { Check, Loader, Pencil, Plus, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const movieSchema = z.object({
    status: z.enum(["plan to watch", "watching", "completed", "dropped"]),
    rating: z.string().min(0).max(10),
    notes: z.string()
});

type MovieDetailsFormFields = z.infer<typeof movieSchema>;

const MovieDetailsPage = () => {
    const {
        movieDetails,
        getMovieDetails,
        fetchingMovieDetails
    } = useMovieStore();

    const {
        checkTracking,
        getMovieDetails: getTrackedMovieDetails,
        fetchingMovieDetails: trackingFetching,
        addMovie,
        updateMovie,
        deleteMovie
    } = useTrackedMovieStore();
    const [tracking, setTracking] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [userMovieDetails, setUserMovieDetails] = useState<any>({});

    const navigate = useNavigate();
    const unavailablePoster = "https://placehold.co/200x300";
    const { movieID } = useParams();

    const {
        control: movieControl,
        register: movieRegister,
        handleSubmit: handleMovieSubmit,
        setError: setMovieErrors,
        reset: movieReset,
        formState: { errors: movieErrors, isSubmitting: movieIsSubmitting }
    } = useForm<MovieDetailsFormFields>({
        resolver: zodResolver(movieSchema),
        defaultValues: {
            status: "plan to watch",
            rating: "0",
            notes: ""
        }
    });

    const onMovieSubmit: SubmitHandler<MovieDetailsFormFields> = async (data) => {
        if (!movieID) { navigate("/dashboard/trending"); return; }
        try {
            if (parseInt(data.rating) < 0 || parseInt(data.rating) > 10) {
                setMovieErrors("rating", { message: "Rating must be between 0 and 10." });
                return;
            }
            const response = await updateMovie(movieID?.toString(), data);
            setUserMovieDetails(response.movie);
            setEditing(false);
        } catch (error) {
            console.log("Error updating movie:", error);
        }
    }

    const handleAddMovie = async () => {
        movieReset();
        if (!movieID) { navigate("/dashboard/trending"); return; }
        try {
            const response = await addMovie(movieID?.toString());
            setUserMovieDetails(response.movie);
            setTracking(true);
        } catch (error) {
            console.log("Error tracking movie:", error);
            setTracking(false);
        }
    }

    const handleDeleteMovie = async () => {
        movieReset();
        if (!movieID) { navigate("/dashboard/trending"); return; }
        try {
            await deleteMovie(movieID?.toString());
            setTracking(false);
            setUserMovieDetails({});
        } catch (error) {
            console.log("Error tracking movie:", error);
            setTracking(true);
        }
    }

    useEffect(() => {
        const onStartFetchingMovieDetails = async () => {
            if (!movieID) { navigate("/dashboard/trending"); return; }
            try {
                await getMovieDetails(movieID?.toString());
            } catch (error) {
                console.log("Error getting movie details:", error);
                toast({
                    variant: "destructive",
                    description: "Error getting movie details."
                });
                navigate("/dashboard/trending");
            }

            let movieTracked = false;

            try {
                const response = await checkTracking(movieID?.toString());
                setTracking(response.tracking);
                movieTracked = response.tracking;
            } catch (error) {
                console.log("Error checking tracking:", error);
                setTracking(false);
            }

            if (movieTracked) {
                try {
                    const response = await getTrackedMovieDetails(movieID?.toString());
                    setUserMovieDetails(response.movie);
                } catch (error) {
                    console.log("Error getting tracked movie details:", error);
                }
            }
        }

        onStartFetchingMovieDetails();
    }, []);

    return (
        <SidebarProvider>
                <DashboardSidebar/>
                <main className="flex flex-col flex-1">
                    <SidebarTrigger className="size-10"/>

                    <div className="container mx-auto p-6 max-w-7xl">
                    { fetchingMovieDetails ? (
                        <div className="flex justify-center items-center">
                            <Loader className="size-10 animate-spin"/>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center mb-6">
                            <h1 className="text-3xl font-bold">{movieDetails.title}</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-center items-center">
                                    <img src={movieDetails.poster_path ? "https://image.tmdb.org/t/p/original" + movieDetails.poster_path : unavailablePoster} alt={movieDetails.title} className="w-full h-full object-cover rounded"/>
                                </div>
                                <div>
                                    <div className="flex flex-col mt-2 text-center font-semibold">
                                        <p>Rating: {Math.round(movieDetails.vote_average * 10) / 10}/10</p>
                                        <p>Released: {movieDetails.release_date}</p>
                                        <p>Overview: {movieDetails.overview}</p>
                                        <p>Genres: {movieDetails.genres?.map((genre: { name: string }) => genre.name).join(", ")}</p>
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
                                                            <p>User Status: {userMovieDetails.status ? userMovieDetails.status : "Not updated"}</p>
                                                            <p>User Rating: {userMovieDetails.rating || (userMovieDetails.rating == 0) ? Math.round(userMovieDetails.rating * 10) / 10 + "/10" : "Not updated"}</p>
                                                            <p className="mt-2">User Notes</p>
                                                            <p>{userMovieDetails.notes ? userMovieDetails.notes : ""}</p>
                                                        </div>
                                                        <Button variant="search" onClick={() => setEditing(true)} className="mt-2 w-1/2">
                                                            <Pencil />
                                                        </Button>
                                                        <Button variant="destructive" onClick={handleDeleteMovie} className="mt-2 w-1/2">
                                                            <Trash2 />
                                                        </Button>
                                                    </>
                                                )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mt-2 flex flex-col text-center">
                                                        <form onSubmit={handleMovieSubmit(onMovieSubmit)} className="space-y-4 pt-4">
                                                            <div className="mt-2 flex flex-col text-center">
                                                                <Label>Status</Label>
                                                                <FormField control={movieControl} name="status" render={({ field }) => (
                                                                    <Select 
                                                                    defaultValue={ userMovieDetails.status ? userMovieDetails.status : "plan to watch" }
                                                                    onValueChange={field.onChange}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent {...movieRegister("status")}>
                                                                            <SelectItem value="plan to watch">Plan to watch</SelectItem>
                                                                            <SelectItem value="watching">Watching</SelectItem>
                                                                            <SelectItem value="completed">Completed</SelectItem>
                                                                            <SelectItem value="dropped">Dropped</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )} />
                                                                {movieErrors.status && <p className="text-red-500 text-sm">{movieErrors.status.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Label>Rating</Label>
                                                                <Input
                                                                {...movieRegister("rating")}
                                                                defaultValue={ userMovieDetails.rating ? parseInt(userMovieDetails.rating) : "0" }
                                                                type="number"
                                                                placeholder="Enter your rating"
                                                                className="w-full" /> 
                                                                {movieErrors.rating && <p className="text-red-500 text-sm">{movieErrors.rating.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Label>Notes</Label>
                                                                <Textarea
                                                                { ...movieRegister("notes") }
                                                                defaultValue={ userMovieDetails.notes ? userMovieDetails.notes : "" }
                                                                placeholder="Enter your notes"
                                                                className="w-full" />
                                                                {movieErrors.notes && <p className="text-red-500 text-sm">{movieErrors.notes.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Button variant="success" disabled={movieIsSubmitting} type="submit" className="mt-2 w-1/2">
                                                                    <Check />
                                                                </Button>
                                                                <Button variant="destructive" onClick={() => setEditing(false)} className="mt-2 w-1/2">
                                                                    <X />
                                                                </Button>
                                                            </div>

                                                            {movieErrors.root && <p className="text-red-500 text-sm">{movieErrors.root.message}</p>}
                                                        </form>
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            <Button variant="success" onClick={handleAddMovie} className="mt-2 w-full">
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

export default MovieDetailsPage;
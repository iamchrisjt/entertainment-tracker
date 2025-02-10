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

import { useGameStore, useTrackedGameStore } from "@/store/useGameStore";

import { Check, Loader, Pencil, Plus, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const gameSchema = z.object({
    status: z.enum(["plan to play", "playing", "finished", "dropped"]),
    rating: z.string().min(0).max(10),
    notes: z.string()
});

type GameDetailsFormFields = z.infer<typeof gameSchema>;

const GameDetailsPage = () => {
    const { 
        gameDetails, 
        getGameDetails, 
        fetchingGameDetails 
    } = useGameStore();

    const {
        checkTracking,
        getGameDetails: getTrackedGameDetails,
        fetchingGameDetails: trackingFetchingGame,
        addGame,
        updateGame,
        deleteGame
    } = useTrackedGameStore();

    const [tracking, setTracking] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [userGameDetails, setUserGameDetails] = useState<any>({});

    const navigate = useNavigate();
    const unavailablePoster = "https://placehold.co/200x300";
    const { gameID } = useParams();

    const {
        control: gameControl,
        register: gameRegister,
        handleSubmit: handleGameSubmit,
        setError: setGameErrors,
        reset: gameReset,
        formState: { errors: gameErrors, isSubmitting: gameIsSubmitting }
    } = useForm<GameDetailsFormFields>({
        resolver: zodResolver(gameSchema),
        defaultValues: {
            status: "plan to play",
            rating: "0",
            notes: ""
        }
    });

    const onGameSubmit: SubmitHandler<GameDetailsFormFields> = async (data) => {
        if (!gameID) { navigate("/dashboard/trending"); return; }
        try {
            if (parseInt(data.rating) < 0 || parseInt(data.rating) > 10) {
                setGameErrors("rating", { message: "Rating must be between 0 and 10." });
                return;
            }
            const response = await updateGame(gameID?.toString(), data);
            setUserGameDetails(response.game);
            setEditing(false);
        } catch (error) {
            console.log("Error updating game:", error);
        }
    }

    const handleAddGame = async () => {
        gameReset();
        if (!gameID) { navigate("/dashboard/trending"); return; }
        try {
            const response = await addGame(gameID?.toString());
            setUserGameDetails(response.game);
            setTracking(true);
        } catch (error) {
            console.log("Error tracking game:", error);
            setTracking(false);
        }
    }

    const handleDeleteGame = async () => {
        gameReset();
        if (!gameID) { navigate("/dashboard/trending"); return; }
        try {
            await deleteGame(gameID?.toString());
            setTracking(false);
            setUserGameDetails({});
        } catch (error) {
            console.log("Error tracking game:", error);
            setTracking(true);
        }
    }

    useEffect(() => {
        const onStartFetchingGameDetails = async () => {
            if (!gameID) { navigate("/dashboard/trending"); return; }
            try {
                await getGameDetails(gameID?.toString());
            } catch (error) {
                console.log("Error getting game details:", error);
                toast({
                    variant: "destructive",
                    description: "Error getting game details."
                });
                navigate("/dashboard/trending");
            }

            let gameTracked = false;

            try {
                const response = await checkTracking(gameID?.toString());
                setTracking(response.tracking);
                gameTracked = response.tracking;
            } catch (error) {
                console.log("Error checking tracking:", error);
                setTracking(false);
            }

            if (gameTracked) {
                try {
                    const response = await getTrackedGameDetails(gameID?.toString());
                    setUserGameDetails(response.game);
                } catch (error) {
                    console.log("Error getting tracked game details:", error);
                }
            }
        }

        onStartFetchingGameDetails();
    }, []);

    return (
        <SidebarProvider>
                <DashboardSidebar/>
                <main className="flex flex-col flex-1">
                    <SidebarTrigger className="size-10"/>

                    <div className="container mx-auto p-6 max-w-7xl">
                    { fetchingGameDetails && gameDetails ? (
                        <div className="flex justify-center items-center">
                            <Loader className="size-10 animate-spin"/>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center mb-6">
                            <h1 className="text-3xl font-bold">{gameDetails.name}</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-center items-center">
                                    <img src={gameDetails.cover?.image_id ? "https://images.igdb.com/igdb/image/upload/t_cover_big/" + gameDetails.cover?.image_id + ".jpg" : unavailablePoster} alt={gameDetails.name} className="w-full h-full aspect-auto object-cover rounded"/>
                                </div>
                                <div>
                                    <div className="flex flex-col mt-2 text-center font-semibold">
                                        <p>Rating: {Math.round(gameDetails.total_rating * 10) / 10}/10</p>
                                        <p>Released: {new Date(gameDetails.first_release_date * 1000).toLocaleDateString()}</p>
                                        <p>Overview: {gameDetails.summary}</p>
                                        <p>Genres: {gameDetails.genres?.map((genre: { name: string }) => genre.name).join(", ")}</p>
                                    </div>
                                    <div className="mt-20">
                                        { tracking ? (
                                            (!editing) ? (
                                                <>
                                                {trackingFetchingGame ? (
                                                    <Loader className="size-10 animate-spin flex text-center justify-center items-center"/>
                                                ) : (
                                                    <>
                                                        <div className="mt-2 flex flex-col text-center">
                                                            <p>User Status: {userGameDetails.status ? userGameDetails.status : "Not updated"}</p>
                                                            <p>User Rating: {userGameDetails.rating || (userGameDetails.rating == 0) ? Math.round(userGameDetails.rating * 10) / 10 + "/10" : "Not updated"}</p>
                                                            <p className="mt-2">User Notes</p>
                                                            <p>{userGameDetails.notes ? userGameDetails.notes : ""}</p>
                                                        </div>
                                                        <Button variant="search" onClick={() => setEditing(true)} className="mt-2 w-1/2">
                                                            <Pencil />
                                                        </Button>
                                                        <Button variant="destructive" onClick={handleDeleteGame} className="mt-2 w-1/2">
                                                            <Trash2 />
                                                        </Button>
                                                    </>
                                                )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mt-2 flex flex-col text-center">
                                                        <form onSubmit={handleGameSubmit(onGameSubmit)} className="space-y-4 pt-4">
                                                            <div className="mt-2 flex flex-col text-center">
                                                                <Label>Status</Label>
                                                                <FormField control={gameControl} name="status" render={({ field }) => (
                                                                    <Select 
                                                                    defaultValue={ userGameDetails.status ? userGameDetails.status : "plan to watch" }
                                                                    onValueChange={field.onChange}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select a status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent {...gameRegister("status")}>
                                                                            <SelectItem value="plan to play">Plan to play</SelectItem>
                                                                            <SelectItem value="playing">Playing</SelectItem>
                                                                            <SelectItem value="finished">Finished</SelectItem>
                                                                            <SelectItem value="dropped">Dropped</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )} />
                                                                {gameErrors.status && <p className="text-red-500 text-sm">{gameErrors.status.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Label>Rating</Label>
                                                                <Input
                                                                {...gameRegister("rating")}
                                                                defaultValue={ userGameDetails.rating ? parseInt(userGameDetails.rating) : "0" }
                                                                type="number"
                                                                placeholder="Enter your rating"
                                                                className="w-full" /> 
                                                                {gameErrors.rating && <p className="text-red-500 text-sm">{gameErrors.rating.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Label>Notes</Label>
                                                                <Textarea
                                                                { ...gameRegister("notes") }
                                                                defaultValue={ userGameDetails.notes ? userGameDetails.notes : "" }
                                                                placeholder="Enter your notes"
                                                                className="w-full" />
                                                                {gameErrors.notes && <p className="text-red-500 text-sm">{gameErrors.notes.message}</p>}
                                                            </div>

                                                            <div className="mt-2">
                                                                <Button variant="success" disabled={gameIsSubmitting} type="submit" className="mt-2 w-1/2">
                                                                    <Check />
                                                                </Button>
                                                                <Button variant="destructive" onClick={() => setEditing(false)} className="mt-2 w-1/2">
                                                                    <X />
                                                                </Button>
                                                            </div>

                                                            {gameErrors.root && <p className="text-red-500 text-sm">{gameErrors.root.message}</p>}
                                                        </form>
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            <Button variant="success" onClick={handleAddGame} className="mt-2 w-full">
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

export default GameDetailsPage;
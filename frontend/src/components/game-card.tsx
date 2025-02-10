import { 
	Card, 
	CardContent, 
	CardHeader, 
	CardTitle 
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import { useTrackedGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Sample data interfaces
interface GameCardProps {
	id: number;
	name: string;
	rating: number;
    cover?: {
        image_id: string;
    }
}

const GameCard : React.FC<GameCardProps> = (props) => {
    const { id, name, rating, cover } = props;
    const poster = cover?.image_id;
    const unavailablePoster = "https://placehold.co/200x300";
    const { checkTracking, addGame, deleteGame } = useTrackedGameStore();
    const [tracking, setTracking] = useState<boolean>(false);

    const handleAddGame = async () => {
        try {
            await addGame(id.toString());
            setTracking(true);
        } catch (error) {
            console.log("Error tracking game:", error);
            setTracking(false);
        }
    }

    const handleDeleteMovie = async () => {
        try {
            await deleteGame(id.toString());
            setTracking(false);
        } catch (error) {
            console.log("Error tracking game:", error);
            setTracking(true);
        }
    }

    useEffect(() => {
        const getGameTracking = async () => {
            const response = await checkTracking(id.toString());
            setTracking(response.tracking);
        }

        getGameTracking();
    }, []);

    return (
        <Card key={id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-center text-lg truncate">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <img src={poster ? "https://images.igdb.com/igdb/image/upload/t_cover_big/" + poster + ".jpg" : unavailablePoster} alt={name} className="w-full h-full object-cover rounded"/>
                <div className="mt-2 text-center font-semibold">
                    Rating: {Math.round(rating * 10) / 10}/100
                </div>
                <div>
                    {
                        !tracking ? (
                            <Button variant="success" onClick={handleAddGame} className="mt-2 w-1/2">
                                <Plus />
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={handleDeleteMovie} className="mt-2 w-1/2">
                                <Trash2 />
                            </Button>
                        )
                    }
                    <Button variant="search" className="mt-2 w-1/2" asChild>
                        <Link to={"/dashboard/games/" + id}>
                            <Search />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
)}

export default GameCard;
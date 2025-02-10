import { 
	Card, 
	CardContent, 
	CardHeader, 
	CardTitle 
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import { useTrackedTvShowStore } from "@/store/useTvShowStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Sample data interfaces
interface TvShowCardProps {
	id: number;
	name: string;
	vote_average: number;
	poster_path: string;
}

const TvShowCard : React.FC<TvShowCardProps> = (props) => {
    const { id, name, vote_average: rating, poster_path: poster } = props;
    const unavailablePoster = "https://placehold.co/200x300";
    const { checkTracking, addTvShow, deleteTvShow } = useTrackedTvShowStore();
    const [tracking, setTracking] = useState<boolean>(false);

    const handleAddTvShow = async () => {
        try {
            await addTvShow(id.toString());
            setTracking(true);
        } catch (error) {
            console.log("Error tracking tv show:", error);
            setTracking(false);
        }
    }

    const handleDeleteTvShow = async () => {
        try {
            await deleteTvShow(id.toString());
            setTracking(false);
        } catch (error) {
            console.log("Error tracking tv show:", error);
            setTracking(true);
        }
    }

    useEffect(() => {
        const getTvShowTracking = async () => {
            const response = await checkTracking(id.toString());
            setTracking(response.tracking);
        }

        getTvShowTracking();
    }, []);

    return (
        <Card key={id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-center text-lg truncate">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <img src={poster ? "https://image.tmdb.org/t/p/original" + poster : unavailablePoster} alt={name} className="w-full h-full object-cover rounded"/>
                <div className="mt-2 text-center font-semibold">
                    Rating: {Math.round(rating * 10) / 10}/10
                </div>
                <div>
                    {
                        !tracking ? (
                            <Button variant="success" onClick={handleAddTvShow} className="mt-2 w-1/2">
                                <Plus />
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={handleDeleteTvShow} className="mt-2 w-1/2">
                                <Trash2 />
                            </Button>
                        )
                    }
                    <Button variant="search" className="mt-2 w-1/2" asChild>
                        <Link to={"/dashboard/tv-shows/" + id}>
                            <Search />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
)}

export default TvShowCard;
import { 
	Card, 
	CardContent, 
	CardHeader, 
	CardTitle 
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Plus, Search, Trash2 } from "lucide-react";
import { useTrackedMovieStore } from "@/store/useMovieStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Sample data interfaces
interface MovieCardProps {
	id: number;
	title: string;
	vote_average: number;
	poster_path: string;
}

const MovieCard : React.FC<MovieCardProps> = (props) => {
    const { id, title, vote_average: rating, poster_path: poster } = props;
    const unavailablePoster = "https://placehold.co/200x300";
    const { checkTracking, addMovie, deleteMovie } = useTrackedMovieStore();
    const [tracking, setTracking] = useState<boolean>(false);

    const handleAddMovie = async () => {
        try {
            await addMovie(id.toString());
            setTracking(true);
        } catch (error) {
            console.log("Error tracking movie:", error);
            setTracking(false);
        }
    }

    const handleDeleteMovie = async () => {
        try {
            await deleteMovie(id.toString());
            setTracking(false);
        } catch (error) {
            console.log("Error tracking movie:", error);
            setTracking(true);
        }
    }

    useEffect(() => {
        const getMovieTracking = async () => {
            const response = await checkTracking(id.toString());
            setTracking(response.tracking);
        }

        getMovieTracking();
    }, []);

    return (
        <Card key={id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-center text-lg truncate">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <img src={poster ? "https://image.tmdb.org/t/p/original" + poster : unavailablePoster} alt={title} className="w-full h-full object-cover rounded"/>
                <div className="mt-2 text-center font-semibold">
                    Rating: {Math.round(rating * 10) / 10}/10
                </div>
                <div>
                    {
                        !tracking ? (
                            <Button variant="success" onClick={handleAddMovie} className="mt-2 w-1/2">
                                <Plus />
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={handleDeleteMovie} className="mt-2 w-1/2">
                                <Trash2 />
                            </Button>
                        )
                    }
                    <Button variant="search" className="mt-2 w-1/2" asChild>
                        <Link to={"/dashboard/movies/" + id}>
                            <Search />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
)}

export default MovieCard;
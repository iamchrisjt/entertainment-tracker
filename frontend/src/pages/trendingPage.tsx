import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { useEffect } from "react";
import { useMovieStore } from "@/store/useMovieStore";
import { useTvShowStore } from "@/store/useTvShowStore";
import { useGameStore } from "@/store/useGameStore";
import MovieCard from "@/components/movie-card";
import TvShowCard from "@/components/tv-show-card";
import GameCard from "@/components/game-card";
import ViewItems from "@/components/view-items-list";

const TrendingPage = () => {
    const {
        movies,
        getMovies,
        fetchingMovies,
        moviePage,
        maxMoviePage,
        changeMoviePage,
        getPreviousMoviePage,
        getNextMoviePage,
        changeActiveMovieQuery
    } = useMovieStore();

    const {
        tvShows,
        getTvShows,
        fetchingTvShows,
        tvShowPage,
        maxTvShowPage,
        changeTvShowPage,
        getPreviousTvShowPage,
        getNextTvShowPage,
        changeActiveTvShowQuery
    } = useTvShowStore();

    const {
        games,
        getGames,
        fetchingGames,
        gamePage,
        maxGamePage,
        changeGamePage,
        getPreviousGamePage,
        getNextGamePage,
        changeActiveGameQuery
    } = useGameStore();

    const handleTabChange = async (value: string) => {
        if (value === "movies") {
            await getMovies();
            useTvShowStore.setState({ tvShows: [] });
            useGameStore.setState({ games: [] });
        } else if (value === "tv-shows") {
            await getTvShows();
            useMovieStore.setState({ movies: [] });
            useGameStore.setState({ games: [] });
        } else if (value === "games") {
            await getGames();
            useMovieStore.setState({ movies: [] });
            useTvShowStore.setState({ tvShows: [] });
        }
    }

    useEffect(() => {
        changeActiveMovieQuery("trending");
        changeActiveTvShowQuery("trending");
        changeActiveGameQuery("popular");
        const fetchTrendingMovies = async () => {
            await getMovies();
            //console.log(useMovieStore.getState().movies);
        };
        fetchTrendingMovies();
    }, []);

    return (
        <SidebarProvider>
                <DashboardSidebar/>
                <main className="flex flex-col flex-1">
                    <SidebarTrigger className="size-10"/>

                    <div className="container mx-auto p-6 max-w-7xl">
                        <div className="flex justify-center items-center mb-6">
                            <h1 className="text-3xl font-bold">Trending</h1>
                        </div>
                        <Tabs onValueChange={handleTabChange} defaultValue="movies" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="movies">Movies</TabsTrigger>
                                <TabsTrigger value="tv-shows">TV Shows</TabsTrigger>
                                <TabsTrigger value="games">Games</TabsTrigger>
                            </TabsList>

                            <TabsContent value="movies" className="pt-4">
                                <ViewItems
                                    itemList={movies}
                                    fetchItemList={getMovies}
                                    fetchingItemList={fetchingMovies}
                                    itemDisplayComponent={MovieCard}
                                    itemPageNumber={moviePage}
                                    maxPageNumber={maxMoviePage}
                                    changePage={changeMoviePage}
                                    itemPreviousPage={getPreviousMoviePage}
                                    itemNextPage={getNextMoviePage}
                                />
                            </TabsContent>

                            <TabsContent value="tv-shows" className="pt-4">
                                <ViewItems
                                    itemList={tvShows}
                                    fetchItemList={getTvShows}
                                    fetchingItemList={fetchingTvShows}
                                    itemDisplayComponent={TvShowCard}
                                    itemPageNumber={tvShowPage}
                                    maxPageNumber={maxTvShowPage}
                                    changePage={changeTvShowPage}
                                    itemPreviousPage={getPreviousTvShowPage}
                                    itemNextPage={getNextTvShowPage}
                                />
                            </TabsContent>

                            <TabsContent value="games" className="pt-4">
                                <ViewItems
                                    itemList={games}
                                    fetchItemList={getGames}
                                    fetchingItemList={fetchingGames}
                                    itemDisplayComponent={GameCard}
                                    itemPageNumber={gamePage}
                                    maxPageNumber={maxGamePage}
                                    changePage={changeGamePage}
                                    itemPreviousPage={getPreviousGamePage}
                                    itemNextPage={getNextGamePage}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
            </main>
        </SidebarProvider>
    )
};

export default TrendingPage;
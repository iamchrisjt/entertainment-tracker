import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

import DefaultWrapper from './components/default-layout.tsx';
import AuthPage from './pages/authPage.tsx';
import TrendingPage from './pages/trendingPage.tsx';
import ViewItemsPage from './pages/viewItemsPage.tsx';

import { useAuthStore } from './store/useAuthStore.ts';
import { useMovieStore, useTrackedMovieStore } from './store/useMovieStore.ts';
import { useTvShowStore, useTrackedTvShowStore } from './store/useTvShowStore.ts';
import { useGameStore, useTrackedGameStore } from './store/useGameStore.ts';

import MovieCard from './components/movie-card.tsx';
import TvShowCard from './components/tv-show-card.tsx';
import GameCard from './components/game-card.tsx';
import ViewTrackedItemsPage from './pages/viewTrackedItemsPage.tsx';
import MovieDetailsPage from './pages/movieDetailsPage.tsx';
import TvShowDetailsPage from './pages/tvShowDetailsPage.tsx';
import GameDetailsPage from './pages/gameDetailsPage.tsx';
import ViewSearchPage from './pages/viewSearchPage.tsx';
import HomePage from './pages/homePage.tsx';

const AppRoutes = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    const {
        movies,
        getMovies,
        fetchingMovies,
        moviePage,
        maxMoviePage,
        changeMoviePage,
        getPreviousMoviePage,
        getNextMoviePage,
        changeActiveMovieQuery,
        movieQueries,

        changeSearchQuery: changeSearchMovieQuery,
        searchMovies,
        searchMoviePage,
        maxSearchMoviePage,
        changeSearchMoviePage,
        getPreviousSearchMoviePage,
        getNextSearchMoviePage,
    } = useMovieStore();

    const {
        getMovies: getTrackedMovies,
        fetchingMovies: fetchingTrackedMovies,
        moviePage: trackedMoviePage,
        maxMoviePage: trackedMaxMoviePage,
        changeMoviePage: changeTrackedMoviePage,
        getPreviousMoviePage: getPreviousTrackedMoviePage,
        getNextMoviePage: getNextTrackedMoviePage,
    } = useTrackedMovieStore();

    const {
        tvShows,
        getTvShows,
        fetchingTvShows,
        tvShowPage,
        maxTvShowPage,
        changeTvShowPage,
        getPreviousTvShowPage,
        getNextTvShowPage,
        changeActiveTvShowQuery,
        tvShowQueries,

        changeSearchQuery: changeSearchTvShowQuery,
        searchTvShows,
        searchTvShowPage,
        maxSearchTvShowPage,
        changeSearchTvShowPage,
        getPreviousSearchTvShowPage,
        getNextSearchTvShowPage,
    } = useTvShowStore();

    const {
        getTvShows: getTrackedTvShows,
        fetchingTvShows: fetchingTrackedTvShows,
        tvShowPage: trackedTvShowPage,
        maxTvShowPage: trackedMaxTvShowPage,
        changeTvShowPage: changeTrackedTvShowPage,
        getPreviousTvShowPage: getPreviousTrackedTvShowPage,
        getNextTvShowPage: getNextTrackedTvShowPage  
    } = useTrackedTvShowStore();

    const {
        games,
        getGames,
        fetchingGames,
        gamePage,
        maxGamePage,
        changeGamePage,
        getPreviousGamePage,
        getNextGamePage,
        changeActiveGameQuery,
        gameQueries,

        changeSearchQuery: changeSearchGameQuery,
        searchGames,
        searchGamePage,
        maxSearchGamePage,
        changeSearchGamePage,
        getPreviousSearchGamePage,
        getNextSearchGamePage,
    } = useGameStore();

    const {
        getGames: getTrackedGames,
        fetchingGames: fetchingTrackedGames,
        gamePage: trackedGamePage,
        maxGamePage: trackedMaxGamePage,
        changeGamePage: changeTrackedGamePage,
        getPreviousGamePage: getPreviousTrackedGamePage,
        getNextGamePage: getNextTrackedGamePage
    } = useTrackedGameStore();


    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) { return (
        <div className="flex justify-center items-center h-screen">
            <Loader className="size-10 animate-spin"/>
        </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={ <DefaultWrapper><HomePage/></DefaultWrapper> }/>
            <Route path="/auth" element={!authUser ? <DefaultWrapper><AuthPage/></DefaultWrapper> : <Navigate to="/dashboard/trending"/>}/>

            <Route path="/dashboard/trending" element={ authUser ? <DefaultWrapper><TrendingPage/></DefaultWrapper> : <Navigate to="/auth"/>} />
            {
                Object.keys(movieQueries).map(type => {
                    return <Route key = {type} path={"/dashboard/movies/" + type} element={ authUser ? (
                        <DefaultWrapper>
                            <ViewItemsPage
                            pageTitle={(type.charAt(0).toUpperCase() + type.slice(1)) + " Movies"}
                            itemList={movies}
                            fetchItemList={getMovies}
                            fetchingItemList={fetchingMovies}
                            itemDisplayComponent={MovieCard}
                            itemPageNumber={moviePage}
                            maxPageNumber={maxMoviePage}
                            changePage={changeMoviePage}
                            itemPreviousPage={getPreviousMoviePage}
                            itemNextPage={getNextMoviePage}
                            itemQueryType={type}
                            changeQueryType={changeActiveMovieQuery}
                            />
                        </DefaultWrapper> 
                    ) : <Navigate to="/auth"/>} />
                })
            }

            <Route path="/dashboard/movies/tracked" element={ authUser ? ( 
                <DefaultWrapper>
                    <ViewTrackedItemsPage 
                    pageTitle="Movies Tracked" 
                    itemList={movies} 
                    fetchItemList={getTrackedMovies} 
                    fetchingItemList={fetchingTrackedMovies}
                    itemDisplayComponent={MovieCard} 
                    itemPageNumber={trackedMoviePage}
                    maxPageNumber={trackedMaxMoviePage} 
                    changePage={changeTrackedMoviePage} 
                    itemPreviousPage={getPreviousTrackedMoviePage} 
                    itemNextPage={getNextTrackedMoviePage}/>
                </DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="/dashboard/movies/search" element={ authUser ? ( 
                <DefaultWrapper>
                    <ViewSearchPage
                    pageTitle="Search Movies"
                    changeSearchQuery={changeSearchMovieQuery}
                    searchItemList={movies} 
                    fetchSearchItemList={searchMovies} 
                    fetchingSearchItemList={fetchingMovies}
                    itemDisplayComponent={MovieCard} 
                    itemSearchPageNumber={searchMoviePage}
                    maxSearchPageNumber={maxSearchMoviePage}
                    changeSearchPage={changeSearchMoviePage}
                    itemPreviousSearchPage={getPreviousSearchMoviePage}
                    itemNextSearchPage={getNextSearchMoviePage}/>
                </DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="/dashboard/movies/:movieID" element={ authUser ? ( <DefaultWrapper><MovieDetailsPage/></DefaultWrapper> ) : <Navigate to="/auth"/>} />

            {
                Object.keys(tvShowQueries).map(type => {
                    return <Route key = {type} path={"/dashboard/tv-shows/" + type} element={ authUser ? (
                        <DefaultWrapper>
                            <ViewItemsPage
                            pageTitle={(type.charAt(0).toUpperCase() + type.slice(1)) + " TV Shows"}
                            itemList={tvShows}
                            fetchItemList={getTvShows}
                            fetchingItemList={fetchingTvShows}
                            itemDisplayComponent={TvShowCard}
                            itemPageNumber={tvShowPage}
                            maxPageNumber={maxTvShowPage}
                            changePage={changeTvShowPage}
                            itemPreviousPage={getPreviousTvShowPage}
                            itemNextPage={getNextTvShowPage}
                            itemQueryType={type}
                            changeQueryType={changeActiveTvShowQuery}
                            />
                        </DefaultWrapper> 
                    ) : <Navigate to="/auth"/>} />
                })
            }

            <Route path="/dashboard/tv-shows/tracked" element={ authUser ? ( 
                <DefaultWrapper>
                    <ViewTrackedItemsPage 
                    pageTitle="Tv Shows Tracked"
                    itemList={tvShows} 
                    fetchItemList={getTrackedTvShows} 
                    fetchingItemList={fetchingTrackedTvShows}
                    itemDisplayComponent={TvShowCard} 
                    itemPageNumber={trackedTvShowPage}
                    maxPageNumber={trackedMaxTvShowPage} 
                    changePage={changeTrackedTvShowPage} 
                    itemPreviousPage={getPreviousTrackedTvShowPage} 
                    itemNextPage={getNextTrackedTvShowPage}/>
                </DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="/dashboard/tv-shows/search" element={ authUser ? ( 
                <DefaultWrapper>
                    <ViewSearchPage
                    pageTitle="Search TV Shows"
                    changeSearchQuery={changeSearchTvShowQuery}
                    searchItemList={tvShows} 
                    fetchSearchItemList={searchTvShows} 
                    fetchingSearchItemList={fetchingTvShows}
                    itemDisplayComponent={TvShowCard} 
                    itemSearchPageNumber={searchTvShowPage}
                    maxSearchPageNumber={maxSearchTvShowPage}
                    changeSearchPage={changeSearchTvShowPage}
                    itemPreviousSearchPage={getPreviousSearchTvShowPage}
                    itemNextSearchPage={getNextSearchTvShowPage}/>
                </DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="/dashboard/tv-shows/:tvShowID" element={ authUser ? ( <DefaultWrapper><TvShowDetailsPage/></DefaultWrapper> ) : <Navigate to="/auth"/>} />

            {
                Object.keys(gameQueries).map(type => {
                    return <Route key = {type} path={"/dashboard/games/" + type} element={ authUser ? (
                        <DefaultWrapper>
                            <ViewItemsPage
                            pageTitle={(type.charAt(0).toUpperCase() + type.slice(1)) + " Games"}
                            itemList={games}
                            fetchItemList={getGames}
                            fetchingItemList={fetchingGames}
                            itemDisplayComponent={GameCard}
                            itemPageNumber={gamePage}
                            maxPageNumber={maxGamePage}
                            changePage={changeGamePage}
                            itemPreviousPage={getPreviousGamePage}
                            itemNextPage={getNextGamePage}
                            itemQueryType={type}
                            changeQueryType={changeActiveGameQuery}
                            />
                        </DefaultWrapper> 
                    ) : <Navigate to="/auth"/>} />
                })
            }

            <Route path="/dashboard/games/tracked" element={ authUser ? ( 
                <DefaultWrapper>
                    <ViewTrackedItemsPage
                    pageTitle="Games Tracked"
                    itemList={games} 
                    fetchItemList={getTrackedGames} 
                    fetchingItemList={fetchingTrackedGames}
                    itemDisplayComponent={GameCard} 
                    itemPageNumber={trackedGamePage}
                    maxPageNumber={trackedMaxGamePage} 
                    changePage={changeTrackedGamePage} 
                    itemPreviousPage={getPreviousTrackedGamePage} 
                    itemNextPage={getNextTrackedGamePage}/>
                </DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="/dashboard/games/search" element={ authUser ? ( 
                <DefaultWrapper>
                    <ViewSearchPage
                    pageTitle="Search Games"
                    changeSearchQuery={changeSearchGameQuery}
                    searchItemList={games} 
                    fetchSearchItemList={searchGames} 
                    fetchingSearchItemList={fetchingGames}
                    itemDisplayComponent={GameCard} 
                    itemSearchPageNumber={searchGamePage}
                    maxSearchPageNumber={maxSearchGamePage}
                    changeSearchPage={changeSearchGamePage}
                    itemPreviousSearchPage={getPreviousSearchGamePage}
                    itemNextSearchPage={getNextSearchGamePage}/>
                </DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="/dashboard/games/:gameID" element={ authUser ? ( <DefaultWrapper><GameDetailsPage/></DefaultWrapper> ) : <Navigate to="/auth"/>} />

            <Route path="*" element={<Navigate to="/dashboard/trending"/>} /> // Default route
        </Routes>
    );
}

export default AppRoutes;


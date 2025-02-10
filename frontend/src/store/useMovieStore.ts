import { toast } from "@/hooks/use-toast";
import { axiosUserInstance,axiosTMDBInstance } from "../lib/axios";
import { create } from "zustand";

type MovieStore = {
    movieQueries: { [key: string]: string };
    activeMovieQuery: string;
    changeActiveMovieQuery: (query: string) => void;

    movies: any[];
    fetchingMovies: boolean;
    getMovies: () => Promise<any>;

    searchQuery: string;
    changeSearchQuery: (query: string) => void;
    searchMovies: () => Promise<any>;
    searchMoviePage: number;
    maxSearchMoviePage: number;
    changeSearchMoviePage: (page: number) => Promise<any>;
    getPreviousSearchMoviePage: () => Promise<any>;
    getNextSearchMoviePage: () => Promise<any>;

    moviePage: number;
    maxMoviePage: number;
    changeMoviePage: (page: number) => Promise<any>;
    getPreviousMoviePage: () => Promise<any>;
    getNextMoviePage: () => Promise<any>;

    movieDetails: any;
    getMovieDetails: (id: string) => Promise<any>;
    getMultipleMovieDetails: (ids: string[]) => Promise<any>;
    fetchingMovieDetails: boolean;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
    movieQueries: {
        "popular": "movie/popular",
        "upcoming": "movie/upcoming",
        "top-rated": "movie/top_rated",
        "trending": "trending/movie/day"
    },
    activeMovieQuery: "popular",

    movies: [],
    fetchingMovies: false,
    moviePage: 1,
    maxMoviePage: 500,

    movieDetails: {},
    fetchingMovieDetails: false,

    searchQuery: "",
    searchMoviePage: 1,
    maxSearchMoviePage: 10,

    getMovieDetails: async (id: string) => {
        set({ fetchingMovieDetails: true });
        try {
            const response = await axiosTMDBInstance.get(`/movie/${id}`);
            set({ movieDetails: response.data });
            return { movie: response.data };
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ movieDetails: [] });
            throw error;
        } finally {
            set({ fetchingMovieDetails: false });
        }
    },

    getMultipleMovieDetails: async (ids: string[]) => {
        try {
            let movies: any[] = [];
            for (let i = 0; i < ids.length; i++) {
                const response = await axiosTMDBInstance.get(`/movie/${ids[i]}`);
                movies.push(response.data);
            }
            set({ movies: movies });
            return { movies: movies };
        } catch (error) {
            console.log("Error getting movies:", error);
            throw error;
        }
    },

    getMovies: async () => {
        set({ fetchingMovies: true });
        try {
            const response = await axiosTMDBInstance.get(get().movieQueries[get().activeMovieQuery] + "?page=" + get().moviePage);
            set({ movies: response.data.results });
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ movies: [] });
        } finally {
            set({ fetchingMovies: false });
        }
    },

    searchMovies: async () => {
        set({ fetchingMovies: true });
        try {
            const response = await axiosTMDBInstance.get("/search/movie?query=" + get().searchQuery + "&page=" + get().searchMoviePage);
            set({ movies: response.data.results });
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ movies: [] });
        } finally {
            set({ fetchingMovies: false });
        }
    },

    changeSearchQuery: async (query: string) => {
        set({ searchQuery: query });
        set({ searchMoviePage: 1 });
        set({ movies: [] });
        await get().searchMovies();
    },

    getPreviousSearchMoviePage: async() => {
        if (get().searchMoviePage === 1) return;
        set({ searchMoviePage: get().searchMoviePage - 1 });
        set({ movies: [] });
        await get().searchMovies();
    },
    
    getNextSearchMoviePage: async() => {
        if (get().searchMoviePage >= get().maxSearchMoviePage) return;
        set({ searchMoviePage: get().searchMoviePage + 1 });
        set({ movies: [] });
        await get().searchMovies();
    },

    changeSearchMoviePage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxSearchMoviePage) { page = get().maxSearchMoviePage; }
        set({ searchMoviePage: page });
        set({ movies: [] });
        await get().searchMovies();
    },

    getPreviousMoviePage: async() => {
        if (get().moviePage === 1) return;
        set({ moviePage: get().moviePage - 1 });
        set({ movies: [] });
        await get().getMovies();
    },
    
    getNextMoviePage: async() => {
        if (get().moviePage >= get().maxMoviePage) return;
        set({ moviePage: get().moviePage + 1 });
        set({ movies: [] });
        await get().getMovies();
    },

    changeMoviePage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxMoviePage) { page = get().maxMoviePage; }
        set({ moviePage: page });
        set({ movies: [] });
        await get().getMovies();
    },

    changeActiveMovieQuery: (query: string) => {
        set({ activeMovieQuery: query });
        set({ movies: [] });
        set({ moviePage: 1 });
    }
}));

type TrackedMovieStore = {
    movies: [];
    movieIDs: any[];
    fetchingMovies: boolean;
    getMovies: (limit?: number) => Promise<any>;

    moviePage: number;
    movieLimit: number;
    maxMoviePage: number;
    changeMoviePage: (page: number) => Promise<any>;
    getPreviousMoviePage: () => Promise<any>;
    getNextMoviePage: () => Promise<any>;
    
    getMovieDetails: (id: string) => Promise<any>;
    fetchingMovieDetails: boolean;
    
    addMovie: (id: string) => Promise<any>;
    checkTracking: (id: string) => Promise<any>;
    updateMovie: (id: string, data: any) => Promise<any>;
    deleteMovie: (id: string) => Promise<any>;
}

export const useTrackedMovieStore = create<TrackedMovieStore>((set, get) => ({
    movies: [],
    movieIDs: [],
    fetchingMovies: false,
    moviePage: 1,
    movieLimit: 20,
    maxMoviePage: 10,

    fetchingMovieDetails: false,

    getMovieDetails: async (id: string) => {
        set({ fetchingMovieDetails: true });
        try {
            const response = await axiosUserInstance.get(`/track/movie/${id}`);
            return { movie: response.data.movie };
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ movies: [] });
        } finally {
            set({ fetchingMovieDetails: false });
        }
    },

    checkTracking: async (id: string) => {
        try {
            const response = await axiosUserInstance.get(`/track/movie/${id}`, { params: { checkingTracking: true } });
            return { tracking: response.data.tracking };
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ movies: [] });
        }
    },

    updateMovie: async (id: string, data: any) => {
        try {
            const response = await axiosUserInstance.put(`/track/update-movie/${id}`, data);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
            return { movie: response.data.movie };
        } catch (error: any) {
            console.log("Error tracking movie:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    addMovie: async (id: string) => {
        try {
            const response = await axiosUserInstance.post(`/track/add-movie/${id}`);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
            return { movie: response.data.movie };
        } catch (error: any) {
            console.log("Error tracking movie:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    deleteMovie: async (id: string) => {
        try {
            const response = await axiosUserInstance.delete(`/track/delete-movie/${id}`);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
        } catch (error: any) {
            console.log("Error tracking movie:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    getMovies: async () => {
        set({ fetchingMovies: true });
        try {
            const response = await axiosUserInstance.get("/track/movies?limit=" + get().movieLimit + "&page=" + get().moviePage);
            set({ movies: response.data.movies });
            let movieIDs: any[] = []
            response.data.movies.forEach((movie: any) => {
                movieIDs.push(movie.movieID);
            });
            set({ movieIDs: movieIDs });
            await useMovieStore.getState().getMultipleMovieDetails(movieIDs);
            return { movies: response.data.movies };
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ movies: [] });
        } finally {
            set({ fetchingMovies: false });
        }
    },

    getPreviousMoviePage: async() => {
        if (get().moviePage === 1) return;
        set({ moviePage: get().moviePage - 1 });
        set({ movies: [] });
        await get().getMovies();
    },
    
    getNextMoviePage: async() => {
        if (get().moviePage >= get().maxMoviePage) return;
        set({ moviePage: get().moviePage + 1 });
        set({ movies: [] });
        await get().getMovies();
    },

    changeMoviePage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxMoviePage) { page = get().maxMoviePage; }
        set({ moviePage: page });
        set({ movies: [] });
        await get().getMovies();
    }

}));
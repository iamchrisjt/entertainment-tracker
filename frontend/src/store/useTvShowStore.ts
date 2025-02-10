import { toast } from "@/hooks/use-toast";
import { axiosUserInstance, axiosTMDBInstance } from "../lib/axios";
import { create } from "zustand";

type TvShowStore = {
    tvShowQueries: { [key: string]: string };
    activeTvShowQuery: string;
    changeActiveTvShowQuery: (query: string) => void;

    tvShows: any[];
    fetchingTvShows: boolean;
    getTvShows: () => Promise<any>;
    getMultipleTvShowDetails: (ids: string[]) => Promise<any>;

    searchQuery: string;
    changeSearchQuery: (query: string) => void;
    searchTvShows: () => Promise<any>;
    searchTvShowPage: number;
    maxSearchTvShowPage: number;
    changeSearchTvShowPage: (page: number) => Promise<any>;
    getPreviousSearchTvShowPage: () => Promise<any>;
    getNextSearchTvShowPage: () => Promise<any>;

    tvShowPage: number;
    maxTvShowPage: number;
    changeTvShowPage: (page: number) => Promise<any>;
    getPreviousTvShowPage: () => Promise<any>;
    getNextTvShowPage: () => Promise<any>;

    tvShowDetails: any;
    fetchingTvShowDetails: boolean;
    getTvShowDetails: (id: string) => Promise<any>;
}

export const useTvShowStore = create<TvShowStore>((set, get) => ({
    tvShowQueries: {
        "popular": "tv/popular",
        "airing-today": "tv/airing_today",
        "on-the-air": "tv/on_the_air",
        "top-rated": "tv/top_rated",
        "trending": "trending/tv/day"
    },
    activeTvShowQuery: "popular",

    tvShows: [],
    fetchingTvShows: false,
    tvShowPage: 1,
    maxTvShowPage: 500,

    tvShowDetails: {},
    fetchingTvShowDetails: false,

    searchQuery: "",
    searchTvShowPage: 1,
    maxSearchTvShowPage: 10,

    getTvShowDetails: async (id: string) => {
        set({ fetchingTvShowDetails: true });
        try {
            const response = await axiosTMDBInstance.get(`/tv/${id}`);
            set({ tvShowDetails: response.data });
        } catch (error) {
            console.log("Error getting tv shows:", error);
            set({ tvShowDetails: [] });
            throw error;
        } finally {
            set({ fetchingTvShowDetails: false });
        }
    },

    getMultipleTvShowDetails: async (ids: string[]) => {
        try {
            let tvShows: any[] = [];
            for (let i = 0; i < ids.length; i++) {
                const response = await axiosTMDBInstance.get(`/tv/${ids[i]}`);
                tvShows.push(response.data);
            }
            set({ tvShows: tvShows });
            return { tvShows: tvShows };
        } catch (error) {
            console.log("Error getting tv shows:", error);
            throw error;
        }
    },

    getTvShows: async () => {
        set({ fetchingTvShows: true });
        try {
            const response = await axiosTMDBInstance.get(get().tvShowQueries[get().activeTvShowQuery] + "?page=" + get().tvShowPage);
            set({ tvShows: response.data.results });
        } catch (error) {
            console.log("Error getting tv shows:", error);
            set({ tvShows: [] });
        } finally {
            set({ fetchingTvShows: false });
        }
    },

    searchTvShows: async () => {
        set({ fetchingTvShows: true });
        try {
            const response = await axiosTMDBInstance.get("/search/tv?query=" + get().searchQuery + "&page=" + get().searchTvShowPage);
            set({ tvShows: response.data.results });
        } catch (error) {
            console.log("Error getting tv shows:", error);
            set({ tvShows: [] });
        } finally {
            set({ fetchingTvShows: false });
        }
    },

    changeSearchQuery: async (query: string) => {
        set({ searchQuery: query });
        set({ searchTvShowPage: 1 });
        set({ tvShows: [] });
        await get().searchTvShows();
    },

    getPreviousSearchTvShowPage: async() => {
        if (get().searchTvShowPage === 1) return;
        set({ searchTvShowPage: get().searchTvShowPage - 1 });
        set({ tvShows: [] });
        await get().searchTvShows();
    },
    
    getNextSearchTvShowPage: async() => {
        if (get().searchTvShowPage >= get().maxSearchTvShowPage) return;
        set({ searchTvShowPage: get().searchTvShowPage + 1 });
        set({ tvShows: [] });
        await get().searchTvShows();
    },

    changeSearchTvShowPage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxSearchTvShowPage) { page = get().maxSearchTvShowPage; }
        set({ searchTvShowPage: page });
        set({ tvShows: [] });
        await get().searchTvShows();
    },

    getPreviousTvShowPage: async() => {
        if (get().tvShowPage === 1) return;
        set({ tvShowPage: get().tvShowPage - 1 });
        set({ tvShows: [] });
        await get().getTvShows();
    },
    
    getNextTvShowPage: async() => {
        if (get().tvShowPage >= get().maxTvShowPage) return;
        set({ tvShowPage: get().tvShowPage + 1 });
        set({ tvShows: [] });
        await get().getTvShows();
    },

    changeTvShowPage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxTvShowPage) { page = get().maxTvShowPage; }
        set({ tvShowPage: page });
        set({ tvShows: [] });
        await get().getTvShows();
    },

    changeActiveTvShowQuery: (query: string) => {
        set({ activeTvShowQuery: query });
        set({ tvShows: [] });
        set({ tvShowPage: 1 });
    }
}));

type TrackedTvShowStore = {
    tvShows: [];
    tvShowIDs: any[];
    fetchingTvShows: boolean;
    getTvShows: (limit?: number) => Promise<any>;

    tvShowPage: number;
    tvShowLimit: number;
    maxTvShowPage: number;
    changeTvShowPage: (page: number) => Promise<any>;
    getPreviousTvShowPage: () => Promise<any>;
    getNextTvShowPage: () => Promise<any>;
    
    getTvShowDetails: (id: string) => Promise<any>;
    fetchingTvShowDetails: boolean;
    
    addTvShow: (id: string) => Promise<any>;
    checkTracking: (id: string) => Promise<any>;
    updateTvShow: (id: string, data: any) => Promise<any>;
    deleteTvShow: (id: string) => Promise<any>;
}

export const useTrackedTvShowStore = create<TrackedTvShowStore>((set, get) => ({
    tvShows: [],
    tvShowIDs: [],
    fetchingTvShows: false,
    tvShowPage: 1,
    tvShowLimit: 20,
    maxTvShowPage: 10,

    fetchingTvShowDetails: false,

    getTvShowDetails: async (id: string) => {
        set({ fetchingTvShowDetails: true });
        try {
            const response = await axiosUserInstance.get(`/track/tv-show/${id}`);
            return { tvShow: response.data.tvShow };
        } catch (error) {
            console.log("Error getting tv shows:", error);
            set({ tvShows: [] });
        } finally {
            set({ fetchingTvShowDetails: false });
        }
    },

    checkTracking: async (id: string) => {
        try {
            const response = await axiosUserInstance.get(`/track/tv-show/${id}`, { params: { checkingTracking: true } });
            return { tracking: response.data.tracking };
        } catch (error) {
            console.log("Error getting tv shows:", error);
            set({ tvShows: [] });
        }
    },

    updateTvShow: async (id: string, data: any) => {
        try {
            const response = await axiosUserInstance.put(`/track/update-tv-show/${id}`, data);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
            return { tvShow: response.data.tvShow };
        } catch (error: any) {
            console.log("Error tracking tv show:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    addTvShow: async (id: string) => {
        try {
            const response = await axiosUserInstance.post(`/track/add-tv-show/${id}`);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
            return { tvShow: response.data.tvShow };
        } catch (error: any) {
            console.log("Error tracking tv show:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    deleteTvShow: async (id: string) => {
        try {
            const response = await axiosUserInstance.delete(`/track/delete-tv-show/${id}`);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
        } catch (error: any) {
            console.log("Error tracking tv show:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    getTvShows: async () => {
        set({ fetchingTvShows: true });
        try {
            const response = await axiosUserInstance.get("/track/tv-shows?limit=" + get().tvShowLimit + "&page=" + get().tvShowPage);
            set({ tvShows: response.data.tvShows });
            let tvShowIDs: any[] = []
            response.data.tvShows.forEach((tvShow: any) => {
                tvShowIDs.push(tvShow.tvShowID);
            });
            set({ tvShowIDs: tvShowIDs });
            await useTvShowStore.getState().getMultipleTvShowDetails(tvShowIDs);
            return { tvShows: response.data.tvShows };
        } catch (error) {
            console.log("Error getting movies:", error);
            set({ tvShows: [] });
        } finally {
            set({ fetchingTvShows: false });
        }
    },

    getPreviousTvShowPage: async() => {
        if (get().tvShowPage === 1) return;
        set({ tvShowPage: get().tvShowPage - 1 });
        set({ tvShows: [] });
        await get().getTvShows();
    },
    
    getNextTvShowPage: async() => {
        if (get().tvShowPage >= get().maxTvShowPage) return;
        set({ tvShowPage: get().tvShowPage + 1 });
        set({ tvShows: [] });
        await get().getTvShows();
    },

    changeTvShowPage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxTvShowPage) { page = get().maxTvShowPage; }
        set({ tvShowPage: page });
        set({ tvShows: [] });
        await get().getTvShows();
    }

}));
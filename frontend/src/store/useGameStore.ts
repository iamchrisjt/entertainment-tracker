import { toast } from "@/hooks/use-toast";
import { axiosUserInstance, axiosIGDBInstance } from "../lib/axios";
import { create } from "zustand";

type GameStore = {
    gameQueries: { [key: string]: any };
    activeGameQuery: string;
    changeActiveGameQuery: (query: string) => void;

    games: any[];
    fetchingGames: boolean;
    getGames: () => Promise<any>;

    gamePage: number;
    maxGamePage: number;
    changeGamePage: (page: number) => Promise<any>;
    getPreviousGamePage: () => Promise<any>;
    getNextGamePage: () => Promise<any>;

    searchQuery: string;
    changeSearchQuery: (query: string) => void;
    searchGames: () => Promise<any>;
    searchGamePage: number;
    maxSearchGamePage: number;
    changeSearchGamePage: (page: number) => Promise<any>;
    getPreviousSearchGamePage: () => Promise<any>;
    getNextSearchGamePage: () => Promise<any>;

    gameDetails: any;
    getGameDetails: (id: string) => Promise<any>;
    getMultipleGameDetails: (ids: string[]) => Promise<any>;
    fetchingGameDetails: boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
    gameQueries: {
        "popular": ["fields game_id; sort value desc; where popularity_type = 1; limit 500;", "fields *, id, name, rating, cover.image_id; where id = ( $1 ) & themes!=(42); limit 20; offset $2;"],
        "24hr-peak-players": ["fields game_id; sort value desc; where popularity_type = 5; limit 500;", "fields *, id, name, rating, cover.image_id; where id = ( $1 ) & themes!=(42); limit 20; offset $2;"],
        "positive-reviews": ["fields game_id; sort value desc; where popularity_type = 6; limit 500;", "fields *, id, name, rating, cover.image_id; where id = ( $1 ) & themes!=(42); limit 20; offset $2;"],
    },
    activeGameQuery: "popular",

    games: [],
    fetchingGames: false,
    gamePage: 1,
    maxGamePage: 25,

    gameDetails: {},
    fetchingGameDetails: false,

    searchQuery: "",
    searchGamePage: 1,
    maxSearchGamePage: 10,

    getGameDetails: async (id: string) => {
        set({ fetchingGameDetails: true });
        try {
            const response = await axiosIGDBInstance.post(`/games`, "fields *, id, name, rating, cover.image_id, genres.name; where id = " + id + ";");
            set({ gameDetails: response.data[0] });
            return { game: response.data };
        } catch (error) {
            console.log("Error getting games:", error);
            set({ gameDetails: [] });
            throw error;
        } finally {
            set({ fetchingGameDetails: false });
        }
    },

    getMultipleGameDetails: async (ids: string[]) => {
        try {
            let games: any[] = [];
            const combinedIDs = ids.join(",");
            for (let i = 0; i < ids.length; i++) {
                const response = await axiosIGDBInstance.post(`/games/`, "fields *, id, name, rating, cover.image_id; where id = (" + combinedIDs + ");");
                games = response.data;
            }
            set({ games: games });
            return { games: games };
        } catch (error) {
            console.log("Error getting games:", error);
            throw error;
        }
    },

    getGames: async () => {
        set({ fetchingGames: true });
        try {
            let idResponse, response: any;
            if (get().gameQueries[get().activeGameQuery].length === 2) {
                idResponse = await axiosIGDBInstance.post("popularity_primitives", get().gameQueries[get().activeGameQuery][0]);
                response = await axiosIGDBInstance.post("games",
                    get().gameQueries[get().activeGameQuery][1]
                    .replace("$1", idResponse.data.map((game: { game_id: number }) => game.game_id).join(","))
                    .replace("$2", (get().gamePage - 1) * 20));
            }
            
            set({ games: response.data });
        } catch (error) {
            console.log("Error getting" + get().activeGameQuery + "games:", error);
            set({ games: [] });
        } finally {
            set({ fetchingGames: false });
        }
    },

    searchGames: async () => {
        set({ fetchingGames: true });
        try {
            const response = await axiosIGDBInstance.post("games", `fields *, id, name, rating, cover.image_id; search "` + get().searchQuery + `"; limit 20; offset ` + (get().searchGamePage - 1) * 20 + ";");
            set({ games: response.data });
        } catch (error) {
            console.log("Error getting games:", error);
            set({ games: [] });
        } finally {
            set({ fetchingGames: false });
        }
    },

    changeSearchQuery: async (query: string) => {
        set({ searchQuery: query });
        set({ searchGamePage: 1 });
        set({ games: [] });
        await get().searchGames();
    },

    getPreviousSearchGamePage: async() => {
        if (get().searchGamePage === 1) return;
        set({ searchGamePage: get().searchGamePage - 1 });
        set({ games: [] });
        await get().searchGames();
    },
    
    getNextSearchGamePage: async() => {
        if (get().searchGamePage >= get().maxSearchGamePage) return;
        set({ searchGamePage: get().searchGamePage + 1 });
        set({ games: [] });
        await get().searchGames();
    },

    changeSearchGamePage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxSearchGamePage) { page = get().maxSearchGamePage; }
        set({ searchGamePage: page });
        set({ games: [] });
        await get().searchGames();
    },

    getPreviousGamePage: async() => {
        if (get().gamePage === 1) return;
        set({ gamePage: get().gamePage - 1 });
        set({ games: [] });
        await get().getGames();
    },

    getNextGamePage: async() => {
        if (get().gamePage === get().maxGamePage) return;
        set({ gamePage: get().gamePage + 1 });
        set({ games: [] });
        await get().getGames();
    },

    changeGamePage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxGamePage) { page = get().maxGamePage; }
        set({ gamePage: page });
        set({ games: [] });
        await get().getGames();
    },

    changeActiveGameQuery: (query: string) => {
        set({ activeGameQuery: query });
        set({ games: [] });
        set({ gamePage: 1 });
    }

}));

// const lastYear = new Date().getFullYear() - 1;
// const currentDate = new Date().getFullYear();
// const response = await axiosRAWGInstance.get(`/games?key=${import.meta.env.VITE_RAWG_API}&dates=${lastYear},${currentDate}&ordering=-rating&page_size=20`);
// set({ popularGames: response.data.results });

type TrackedGameStore = {
    games: [];
    gameIDs: any[];
    fetchingGames: boolean;
    getGames: (limit?: number) => Promise<any>;

    gamePage: number;
    gameLimit: number;
    maxGamePage: number;
    changeGamePage: (page: number) => Promise<any>;
    getPreviousGamePage: () => Promise<any>;
    getNextGamePage: () => Promise<any>;
    
    getGameDetails: (id: string) => Promise<any>;
    fetchingGameDetails: boolean;
    
    addGame: (id: string) => Promise<any>;
    checkTracking: (id: string) => Promise<any>;
    updateGame: (id: string, data: any) => Promise<any>;
    deleteGame: (id: string) => Promise<any>;
}

export const useTrackedGameStore = create<TrackedGameStore>((set, get) => ({
    games: [],
    gameIDs: [],
    fetchingGames: false,
    gamePage: 1,
    gameLimit: 20,
    maxGamePage: 10,

    fetchingGameDetails: false,

    getGameDetails: async (id: string) => {
        set({ fetchingGameDetails: true });
        try {
            const response = await axiosUserInstance.get(`/track/game/${id}`);
            return { game: response.data.game };
        } catch (error) {
            console.log("Error getting games:", error);
            set({ games: [] });
        } finally {
            set({ fetchingGameDetails: false });
        }
    },

    checkTracking: async (id: string) => {
        try {
            const response = await axiosUserInstance.get(`/track/game/${id}`, { params: { checkingTracking: true } });
            return { tracking: response.data.tracking };
        } catch (error) {
            console.log("Error getting games:", error);
            set({ games: [] });
        }
    },

    updateGame: async (id: string, data: any) => {
        try {
            const response = await axiosUserInstance.put(`/track/update-game/${id}`, data);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
            return { game: response.data.game };
        } catch (error: any) {
            console.log("Error tracking game:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    addGame: async (id: string) => {
        try {
            const response = await axiosUserInstance.post(`/track/add-game/${id}`);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
            return { game: response.data.game };
        } catch (error: any) {
            console.log("Error tracking game:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    deleteGame: async (id: string) => {
        try {
            const response = await axiosUserInstance.delete(`/track/delete-game/${id}`);
            toast({
				variant: "success",
				description: `${response.data.message}`,
			});
        } catch (error: any) {
            console.log("Error tracking game:", error);
            toast({
				variant: "destructive",
				description: `${error.response.data.message}`,
			});
        }
    },

    getGames: async () => {
        set({ fetchingGames: true });
        try {
            const response = await axiosUserInstance.get("/track/games?limit=" + get().gameLimit + "&page=" + get().gamePage);
            set({ games: response.data.games });
            let gameIDs: any[] = []
            response.data.games.forEach((game: any) => {
                gameIDs.push(game.gameID);
            });
            set({ gameIDs: gameIDs });
            await useGameStore.getState().getMultipleGameDetails(gameIDs);
            return { games: response.data.games };
        } catch (error) {
            console.log("Error getting games:", error);
            set({ games: [] });
        } finally {
            set({ fetchingGames: false });
        }
    },

    getPreviousGamePage: async() => {
        if (get().gamePage === 1) return;
        set({ gamePage: get().gamePage - 1 });
        set({ games: [] });
        await get().getGames();
    },
    
    getNextGamePage: async() => {
        if (get().gamePage >= get().maxGamePage) return;
        set({ gamePage: get().gamePage + 1 });
        set({ games: [] });
        await get().getGames();
    },

    changeGamePage: async (page: number) => {
        if (page < 1) { page = 1; }
        if (page > get().maxGamePage) { page = get().maxGamePage; }
        set({ gamePage: page });
        set({ games: [] });
        await get().getGames();
    }

}));
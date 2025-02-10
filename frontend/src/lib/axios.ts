import axios from "axios";

export const axiosUserInstance = axios.create({
    baseURL: (import.meta.env.NODE_ENV === "development") ? import.meta.env.VITE_BACKEND_HOST + "/api" : "/api", // the base URL for the API
    withCredentials: true // send cookies with requests
});

export const axiosTMDBInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3/", // the base URL for the API
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_MOVIE_API}` // add your API key here
    }
});

export const axiosRAWGInstance = axios.create({
    baseURL: "https://rawg.io/api/", // the base URL for the API
    headers: {
        "Content-Type": "application/json"
    }
});

export const axiosIGDBInstance = axios.create({
    baseURL: import.meta.env.VITE_CORS_HOST + "/https://api.igdb.com/v4/", // the base URL for the API
    headers: {
        "Accept": "application/json",
        "Content-Type": "text/plain",
        "Client-ID": `${import.meta.env.VITE_GAME_CLIENT_ID}`,
        "Authorization": `Bearer ${import.meta.env.VITE_GAME_API}`, // add your API key here
        "Access-Control-Allow-Origin": "*"
    }
});
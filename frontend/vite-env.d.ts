/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />


interface ImportMetaEnv {
    VITE_MOVIE_API: string;
    VITE_RAWG_API: string;
    VITE_GAME_CLIENT_ID: string;
    VITE_GAME_API: string;
    VITE_BACKEND_HOST: string;
    VITE_CORS_HOST: string;
    VITE_NODE_ENV: "development" | "production";
}

interface ImportMeta {
readonly env: ImportMetaEnv;
}
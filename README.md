Make sure you have Node.js installed on your machine.
Then run the following commands to install the dependencies and start the server:

```bash
npm run build
npm run start
```

This will start the server on port 7000.

Backend .env file:
    PORT can be changed in the .env file.

    You need to set up a MongoDB database and create a connection string in the .env file.
    In the .env file, set the MONGODB_CONNECTION_STRING to the connection string of your MongoDB database.

    You can also set the JWT_SECRET environment variable to a random string of characters.
    The NODE_ENV environment variable should be set to "development" or "production".

    If you want to use CORS, you need to set the CORS_HOST and CORS_PORT environment variables to the host and port you want to use for CORS.
    The ORIGIN environment variable should be set to the origin you want to allow for CORS.

Frontend .env file:
    You need to set the VITE_BACKEND_HOST environment variables to the host and port of your backend server.
    The VITE_CORS_HOST environment variables should be set to the host you want to use for CORS.

    NODE_ENV can be set to "development" or "production".

    VITE_MOVIE_API and VITE_GAME_API and VITE_GAME_CLIENT_ID can be set to the API keys for the TMDB and IGDB APIs.
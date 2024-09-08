# Codematic Test

### Building and running your application

When you're ready, start your application by running:
`npm run start:dev`.

Your application will be available at http://localhost:3000.

### Deploying your application to the cloud

First, build your application by running:
`npm run build`.

Then, deploy the `dist` folder to your cloud provider.

### References

- [Node.js guide](https://nodejs.org/en/docs/guides/)

## High Level Architecture

This codebase is a Node.js application built with Express.js and Sequelize ORM. It follows a modular structure with separate directories for routes, models, services, and utilities.

### Entry Point (`src/app.ts`)

The `app.ts` file is the entry point of the application. It sets up the Express app, configures middleware (CORS, JSON parsing, URL encoding), and mounts the router. It also includes error handling middleware for handling errors and handling 404 routes.

### Router (`src/router/index.ts`)

The `router/index.ts` file defines the API routes for the application. It uses the Express Router to handle different HTTP methods (GET, POST, DELETE) for various routes related to films and comments.

The router utilizes caching with the `node-cache` library to improve performance by caching film data. It interacts with the `Comment` model from the database to perform CRUD operations on comments associated with films.

### Database Model (`src/database/models/Comment.ts`)

The `Comment.ts` file defines the Sequelize model for the `Comment` table in the database. It specifies the schema for the `Comment` table, including fields like `comment`, `filmId`, and `createdAt`.

### Services (`src/services/films.ts`)

The `films.ts` file (not shown) likely contains functions or services related to fetching and manipulating film data from an external source or database.

### Utilities (`src/utils.ts`)

The `utils.ts` file (not shown) likely contains utility functions used throughout the codebase, such as the `pickFields` function mentioned in the router.

### Error Handling Middleware (`src/middlewares/errorHandler.ts`)

The `errorHandler.ts` file (not shown) likely contains middleware for handling errors that occur in the application.

### Not Found Middleware (`src/middlewares/notFoundHandler.ts`)

The `notFoundHandler.ts` file (not shown) likely contains middleware for handling routes that are not found in the application.

Overall, this codebase follows a modular structure with separate concerns for routing, database models, services, and utilities. It leverages caching to improve performance and uses Sequelize ORM for interacting with the database.

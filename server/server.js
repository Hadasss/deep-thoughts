const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
// import typeDefs + resolvers
const { typeDefs, resolvers } = require("../server/schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new instance of an Apollo server with GraphgQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  // integrate out apollo server with the express application as middleware.
  // This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API.
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);

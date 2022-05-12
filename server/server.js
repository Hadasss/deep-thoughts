const express = require("express");
const path = require("path");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
// import typeDefs + resolvers
const { typeDefs, resolvers } = require("../server/schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context.
  context: authMiddleware,
});
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a new instance of an Apollo server with GraphgQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  // integrate out apollo server with the express application as middleware.
  // This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API.
  server.applyMiddleware({ app });

  // serve up static assets (will only come into effect when we go into production)
  // check to see if the Node environment is in production. If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder. a build folder is for production only!
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // a wildcard GET route for the server. In other words, if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  // With Express on the back end, you can define a catch-all route, meaning any route that hasn't been defined would be treated as a 404 and respond with your custom 404.html file.
  app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "./public/404.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);

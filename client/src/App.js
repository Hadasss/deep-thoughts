import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

// we establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  uri: "/graphql", // URI stands for "Uniform Resource Identifier."
  // we added a "proxy" key-value pair to the package.json in the client folder. With this proxy value in place, the Create React App team set up the development server to prefix all HTTP requests using relative paths with whatever value is provided to it. Now the HTTP requests will work in both development and production environments!
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  link: httpLink,
  // We also instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
});

// FYI Notice how we have to use an absolute path to the server? The React environment runs at localhost:3000, and the server environment runs at localhost:3001. So if we just used /graphql, as we've done previously, the requests would go to localhost:3000/graphql—which isn't the address for the back-end server.

function App() {
  return (
    // enable the entire application to interact with our Apollo Client instance: wrap the entire returning JSX code with <ApolloProvider>.
    // Because we're passing the client variable in as the value for the client prop in the provider, everything between the JSX tags will eventually have access to the server's API data through the client we set up
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;

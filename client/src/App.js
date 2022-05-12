import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
//We renamed BrowserRouter to Router to make it easier to work with.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

// we establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  uri: "/graphql", // URI stands for "Uniform Resource Identifier."
  // we added a "proxy" key-value pair to the package.json in the client folder. With this proxy value in place, the Create React App team set up the development server to prefix all HTTP requests using relative paths with whatever value is provided to it. Now the HTTP requests will work in both development and production environments!
});

// create a middleware function that will retrieve the user token and combine it with the existing httpLink
// FYI In this case, we don't need the first parameter offered by setContext(), which stores the current request object, but we still need to access the second one, we can use an underscore _ to serve as a placeholder for the first parameter.
const authLink = setContext((_, { headers }) => {
  // retrieve the token from localStorage
  const token = localStorage.getItem("id_token");
  return {
    // set the HTTP request headers of every request to include the token, whether the request needs it or not. if the request doesn't need it, the server-side resolver function won't check for it.
    headers: { ...headers, authorization: token ? `Bearer ${token}` : "" },
  };
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  // we need to combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API.
  link: authLink.concat(httpLink),
  // We also instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
});

// FYI Notice how we have to use an absolute path to the server? The React environment runs at localhost:3000, and the server environment runs at localhost:3001. So if we just used /graphql, as we've done previously, the requests would go to localhost:3000/graphql—which isn't the address for the back-end server.

function App() {
  return (
    // enable the entire application to interact with our Apollo Client instance: wrap the entire returning JSX code with <ApolloProvider>.
    // Because we're passing the client variable in as the value for the client prop in the provider, everything between the JSX tags will eventually have access to the server's API data through the client we set up
    <ApolloProvider client={client}>
      {/* We've wrapped the <div className="flex-column"> element in a Router component, which makes all of the child components on the page aware of the client-side routing that can take place now: */}
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            {/* we place a singular Routes component that will hold several Route components that signify this part of the app as the place where content will change according to the URL route. When the route is /, the Home component will render here. When the route is /login, the Login component will render. */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* The ? means this parameter is optional */}
              <Route path="/profile/:username?" element={<Profile />} />
              <Route path="/thought/:id" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

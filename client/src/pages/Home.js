import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS } from "../utils/queries";
import ThoughtList from "../components/ThoughtList";

const Home = () => {
  // use useQuery hook to make query requests
  // FYI When we load the Home component in the application, we'll execute the query for the thought data. Because this is asynchronous, just like using fetch(), Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet. When it's finished and we have data returned from the server, that information is stored in the destructured data property.
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  // This syntax is called optional chaining - check if an object even exists before accessing its properties
  //  for this code, it means: if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component.
  // In this case, no data will exist until the query to the server is finished. So if we type data.thoughts, we'll receive an error saying we can't access the property of data — because it is undefined.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {/* ternary operator to conditionally render the <ThoughtList> component. If the query hasn't completed and loading is still defined, we display a message to indicate just that. Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props. */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

import React from "react";
import { Link } from "react-router-dom";

// we instruct that the ThoughtList component will receive two props: a title and the thoughts array. We destructure the argument data to avoid using props.title and props.thoughts throughout the JSX code.
const ThoughtList = ({ thoughts, title }) => {
  if (!thoughts.length) {
    return <h3>No thoughts yet</h3>;
  }
  // We conditionally render JSX by checking to see if there's any data in the thoughts array first. If there's no data, then we return a message stating that. If there is data, then we return a list of thoughts using the .map() method.
  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map((thought) => (
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{" "}
              thought on {thought.createdAt}
            </p>

            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  {/* We're conditionally displaying a message to contextualize what the call to action should be. If there are no reactions, the user will start the discussion by adding the first reaction. If there are reactions, the user will view or add their own reaction to an existing list. */}
                  Reactions: {thought.reactionCount} || Click to{" "}
                  {thought.reactionCount ? "see" : "start"} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;

// FYI The key property in map helps React internally track which data needs to be re-rendered if something changes.

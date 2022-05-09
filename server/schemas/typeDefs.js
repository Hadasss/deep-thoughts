// import the gql tagged template (a special kind of template literals) function
const { gql } = require("apollo-server-express");

// create our typeDefs

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendsCount: Int
    thoughts: [Thought]
    friends: [User]
  }
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }
  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }
  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;

// FYI ! after the query parameter data type definitions indicates that for that query to be carried out, that data must exist. Otherwise, Apollo will return an error to the client making the request and the query won't even reach the resolver function associated with it.

// export the typeDefs
module.exports = typeDefs;

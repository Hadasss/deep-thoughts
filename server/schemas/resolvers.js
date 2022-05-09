const { User, Thought } = require("../models");

const resolvers = {
  Query: {
    // We don't have to worry about error handling here because Apollo can infer if something goes wrong and will respond

    // GET all users
    users: async () => {
      return User.find()
        .select("-__V -password")
        .populate("friends")
        .populate("thoughts");
    },

    // GET user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__V -password")
        .populate("friends")
        .populate("thoughts");
    },

    thoughts: async (parent, { username }) => {
      // the parent is more of a placeholder parameter. It won't be used, but we need something in that first parameter's spot so we can access the username argument on the second parameter spot.
      // We use a ternary operator to check if username exists. If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object.
      const params = username ? { username } : {};
      // We then pass that object, with or without any data in it, to our .find() method. If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought.
      return Thought.find(params).sort({ createdAt: -1 });
    },

    // GET one thought by id:
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
  },
};

module.exports = resolvers;

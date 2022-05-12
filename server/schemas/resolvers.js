const { User, Thought } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // We don't have to worry about error handling here because Apollo can infer if something goes wrong and will respond

    me: async (parent, args) => {
      console.log({ args });
      if (context.user) {
        const userData = await User.findOne({})
          .select("-__V -password")
          .populate("thoughts")
          .populate("friends");

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },

    // GET all users
    users: async () => {
      return User.find()
        .select("-__V -password")
        .populate("friends")
        .populate("thoughts");
    },

    // GET user by username
    user: async (parent, { username }) => {
      // IMPORTANT
      let user =
        username[0].toUpperCase() + username.substring(1, username.length);
      console.log(user);

      return User.findOne({ username: user })
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

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addThought: async (parent, args, context) => {
      // Only logged-in users should be able to use this mutation, hence why we check for the existence of context.user first. the decoded JWT is only added to context if the verification passes.
      if (context.user) {
        // The token includes the user's username, email, and _id properties, which become properties of context.user and can be used in the follow-up Thought.create() and User.findByIdAndUpdate() methods.
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user.id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      // Reactions are stored as arrays on the Thought model,
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $push: {
              reactions: { reactionBody, username: context.user.username },
            },
          },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate("friends");

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;

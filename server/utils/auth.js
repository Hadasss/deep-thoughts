const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    // allow token to be sent via req.body, req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token, return request as object
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object
      // If the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(), the object won't be decoded
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      //  Users with an invalid token should still be able to request and see all thoughts. Thus, we wrapped the verify() method in a try...catch statement to mute the error.
      console.log("invalid token");
    }

    // return updated request object
    return req;
  },
};

// The signToken() function expects a user object and will add that user's username, email, and _id properties to the token. Optionally, tokens can be given an expiration date and a secret to sign the token with. Note that the secret has nothing to do with encoding. The secret merely enables the server to verify whether it recognizes this token.

// If your JWT secret is ever compromised, you'll need to generate a new one, immediately invalidating all current tokens. Because the secret is so important, you should store it somewhere other than in a JavaScript file—like an environment variable.

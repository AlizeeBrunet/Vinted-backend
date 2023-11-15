const User = require("../models/User");
const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    // récupérer le token envoyé dans req.headers.authorization
    const userToken = req.headers.authorization.replace("Bearer ", "");

    // récupérer le owner de l'offre grâce au token
    const user = await User.findOne({ token: userToken }).select("account _id");

    if (!user) {
      return res.status(401).json("Unauthorized");
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = isAuthenticated;

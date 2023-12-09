const { User } = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/HttpError");
const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"))
    
  }
  
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user
    next()
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

module.exports = {
  authenticate,
};

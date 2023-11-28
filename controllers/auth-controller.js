const { User } = require("../models/User.js");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = process.env

const { HttpError } = require("../helpers/HttpError.js");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bycrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
       user: {
        email: newUser.email,
        subscription: newUser.subscription,
       }
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bycrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id
  }
  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '24h'})
  res.json({ token: token,
    user: {
        email: user.email,
        subscription: user.subscription,
       }})
    
  } catch (error) {
    next(error)
    
  }
};

module.exports = {
  signup,
  signin
};

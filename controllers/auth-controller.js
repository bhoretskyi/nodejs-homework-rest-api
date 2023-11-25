const { User } = require("../models/User.js");

const { HttpError } = require("../helpers/HttpError.js");


const signup = async(req,res) => {
const newUser = await User.create(req.body);

res.status(201).json({
    username: newUser.username,
    email: newUser.email
})
}


module.exports = {
    signup
}

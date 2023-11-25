const express = require("express");
const authController = require("../../controllers/auth-controller.js");
const { isEmptyBody } = require("../../middlewares/isEmptyBody.js");
const { userSignUpSchema, userSignInSchema } = require("../../models/User.js");

const authRouter = express.Router();
authRouter.post('/signup', authController.signup )
module.exports = authRouter;

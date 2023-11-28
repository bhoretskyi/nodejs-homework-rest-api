const express = require("express");
const {signup, signin} = require("../../controllers/auth-controller.js");
const { isEmptyBody } = require("../../middlewares/isEmptyBody.js");
const { userSignUpSchema,userSignInSchema } = require("../../models/User.js");
const {validateBody} = require("../../decorators/validateBody.js");

const authRouter = express.Router();
authRouter.post('/register',isEmptyBody, validateBody(userSignUpSchema), signup ) 
authRouter.post('/login',isEmptyBody, validateBody(userSignInSchema), signin ) 

module.exports = authRouter;

const express = require("express");
const {signup, signin, getCurrent, logout} = require("../../controllers/auth-controller.js");
const { isEmptyBody } = require("../../middlewares/isEmptyBody.js");
const { userSignUpSchema,userSignInSchema } = require("../../models/User.js");
const {validateBody} = require("../../decorators/validateBody.js");
const { authenticate } = require("../../middlewares/authenticate.js");

const authRouter = express.Router();
authRouter.post('/register',isEmptyBody, validateBody(userSignUpSchema), signup ) 
authRouter.post('/login',isEmptyBody, validateBody(userSignInSchema), signin ) 
authRouter.get("/current", authenticate, getCurrent)
authRouter.post("/logout", authenticate, logout)

module.exports = authRouter;

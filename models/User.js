const { Schema, model } = require("mongoose");
const { handleSaveError, preUpdate } = require(".//hooks.js");
const emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

const Joi = require("joi");
const userSchema = new Schema(
  {
    // username: {
    //   type: String,
    //   required: true,
    // },
    // email: {
    //   type: String,
    //   match: emailRegexp,
    //   unique: true,
    //   required: true,
    // },
    // password: {
    //   type: String,
    //   minLength: 6,
    //   required: true,
    
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: {
        type: String,
        default: null,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      }
    
    },
  
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
const User = model("user", userSchema);

const userSignUpSchema = Joi.object({
  // username: Joi.string()
  //   .required()
  //   .messages({ "any.required": "missing required username field" }),
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ "any.required": "missing required email field" }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "missing required password field" }),
});

const userSignInSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ "any.required": "missing required email field" }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "missing required password field" }),
});

module.exports = {
  User,
  userSignUpSchema,
  userSignInSchema,
};

const { Schema, model } = require("mongoose");
const { handleSaveError, preUpdate } = require(".//hooks.js");
const emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

const Joi = require("joi");
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: [true, 'Verify token is required'],
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
const userEmailSchema = Joi.object({
  email: Joi.string()
  .required()
  .pattern(emailRegexp)
  .messages({ "any.required": "missing required email field" }),
})

module.exports = {
  User,
  userSignUpSchema,
  userSignInSchema,
  userEmailSchema
};

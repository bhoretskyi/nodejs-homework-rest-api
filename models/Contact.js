const { Schema, model } = require("mongoose");
const { handleSaveError, preUpdate } = require(".//hooks.js");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handleSaveError);
contactSchema.post("findOneAndUpdate", handleSaveError);
contactSchema.pre("findOneAndUpdate", preUpdate );
const Contact = model("contact", contactSchema);

const contactAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "missing required name field" }),
  email: Joi.string()
    .required()
    .messages({ "any.required": "missing required email field" }),
  phone: Joi.string()
    .required()
    .messages({ "any.required": "missing required phone field" }),
  favorite: Joi.boolean().optional(),
});
const contactUpdateSchema = Joi.object({
  name: Joi.string(),

  email: Joi.string(),

  phone: Joi.string(),
});

const contactFavoriteSchema = Joi.object({
  favorite : Joi.boolean().required()
})

module.exports = {
  Contact,
  contactAddSchema,
  contactUpdateSchema,
  contactFavoriteSchema
};

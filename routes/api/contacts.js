const express = require("express");
// const contactsModule = require("../../models/contacts.js");
const { HttpError } = require("../../helpers/HttpError.js");
const {Contact, contactAddSchema} = require('../../models/Contact.js')
// const Joi = require("joi");
const { isEmptyBody } = require("../../middlewares/isEmptyBody.js");
const {isValidId} = require("../../middlewares/isValidId.js")


// const contactUpdateSchema = Joi.object({
//   name: Joi.string(),

//   email: Joi.string(),

//   phone: Joi.number(),
// });

const router = express.Router();
// contactsModule.listContacts();
router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find({}, "-createdAt -updatedAt");
    if (!contacts) {
      throw HttpError(404, "Not Found");
    }
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId",isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await Contact.findById(contactId);
    if (!oneContact) {
      throw HttpError(404, "Not found");
    }
    res.json(oneContact);
  } catch (error) {
    next(error);
  }
});

router.post("/", isEmptyBody, async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await Contact.create(req.body)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// router.delete("/:contactId", async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const result = await contactsModule.removeContact(contactId, req.body);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.json({"message": "contact deleted"});
//   } catch (error) {
//     next(error);
//   }
// });

// router.put("/:contactId", isEmptyBody, async (req, res, next) => {
//   try {
//     const { error } = contactUpdateSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const { contactId } = req.params;
//     const result = await contactsModule.updateContact(contactId, req.body);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;

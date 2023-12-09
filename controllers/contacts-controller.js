const {
  Contact,
  contactAddSchema,
  contactUpdateSchema,
  contactFavoriteSchema,
} = require("../models/Contact.js");
const { HttpError } = require("../helpers/HttpError.js");
const fs = require("fs/promises");
const path = require("path");
const avatarsPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const { _id: owner } = req.user;
  const skip = (page - 1) * limit;

  try {
    const contacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    });
    if (!contacts) {
      throw HttpError(404, "Not Found");
    }
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactByID = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  try {
    const oneContact = await Contact.findById({ _id: contactId, owner });
    if (!oneContact) {
      throw HttpError(404, "Not found");
    }
    res.json(oneContact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
const avatarURL = path.join( 'avatars', filename)
    const result = await Contact.create({ ...req.body, owner, avatarURL });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndDelete({ _id: contactId, owner });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const updateFavoriteContact = async (req, res, next) => {
  try {
    const { error } = contactFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllContacts,
  getContactByID,
  addContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
};

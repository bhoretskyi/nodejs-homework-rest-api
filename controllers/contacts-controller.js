const {
    Contact,
    contactAddSchema,
    contactUpdateSchema,
    contactFavoriteSchema,
  } = require("../models/Contact.js");
  const{HttpError} = require('../helpers/HttpError.js')

  const getAllContacts = async (req, res, next) => {
    try {
      const contacts = await Contact.find({}, "-createdAt -updatedAt");
      if (!contacts) {
        throw HttpError(404, "Not Found");
      }
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  }

  const getContactByID = async (req, res, next) => {
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
  }


  const addContact = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const result = await Contact.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }


  const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await Contact.findByIdAndDelete(contactId);
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json({ message: "contact deleted" });
    } catch (error) {
      next(error);
    }
  }

  const updateContact = async (req, res, next) => {
    try {
      const { error } = contactUpdateSchema.validate(req.body);
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
  }
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
  }
  module.exports = {
    getAllContacts,
    getContactByID,
    addContact,
    deleteContact,
    updateContact,
    updateFavoriteContact
  }
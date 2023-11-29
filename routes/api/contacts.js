const express = require("express");
// const { HttpError } = require("../../helpers/HttpError.js");

const { isEmptyBody } = require("../../middlewares/isEmptyBody.js");
const { isValidId } = require("../../middlewares/isValidId.js");
const {
  getAllContacts,
  getContactByID,
  addContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
} = require("../../controllers/contacts-controller.js");
const { authenticate } = require("../../middlewares/authenticate.js");

const router = express.Router();

router.use(authenticate)
router.get("/", getAllContacts);

router.get("/:contactId", isValidId, getContactByID);

router.post("/", isEmptyBody, addContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", isValidId, isEmptyBody, updateContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  updateFavoriteContact
);

module.exports = router;

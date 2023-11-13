const express = require("express");
const contactsModule = require("../../models/contacts.js");

const router = express.Router();
contactsModule.listContacts();
router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsModule.listContacts();
    res.json(contacts);
  } catch (error) {
    res.json({ error: "Serwer error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;

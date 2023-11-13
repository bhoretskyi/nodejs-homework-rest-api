const fs = require("fs/promises");
const path = require("path");

const contactsFilePath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const jsonData = await fs.readFile(contactsFilePath, "utf-8");
    const data = JSON.parse(jsonData);
   return data
    
  } catch (error) {
    console.error("Ошибка при чтении файла контактов:", error.message);
  }
 
};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

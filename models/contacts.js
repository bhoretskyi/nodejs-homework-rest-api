const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsFilePath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const jsonData = await fs.readFile(contactsFilePath, "utf-8");
  const data = JSON.parse(jsonData);
  return data;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((c) => c.id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  console.log(body);
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

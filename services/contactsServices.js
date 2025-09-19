const Contact = require("../models/contact");

async function listContacts() {
  return await Contact.findAll();
}

async function getContactById(id) {
  return await Contact.findByPk(id);
}

async function removeContact(id) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

async function addContact(data) {
  return await Contact.create(data);
}

async function updateContact(id, data) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  return await contact.update(data);
}

async function updateStatusContact(id, data) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  return await contact.update({ favorite: data.favorite });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

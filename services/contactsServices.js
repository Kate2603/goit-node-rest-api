const Contact = require("../models/contact");

// Отримати всі контакти користувача
async function listContacts(owner) {
  return await Contact.findAll({ where: { owner } });
}

// Отримати контакт за ID + owner
async function getContactById(id, owner) {
  return await Contact.findOne({ where: { id, owner } });
}

// Видалити контакт за ID + owner
async function removeContact(id, owner) {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

// Додати новий контакт з owner
async function addContact(data, owner) {
  return await Contact.create({ ...data, owner });
}

// Оновити контакт за ID + owner
async function updateContact(id, data, owner) {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  return await contact.update(data);
}

// Оновити статус favorite за ID + owner
async function updateStatusContact(id, favorite, owner) {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  return await contact.update({ favorite });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

const services = require("../services/contactsServices");
const HttpError = require("../helpers/HttpError");

async function getAll(req, res, next) {
  try {
    const result = await services.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await services.getContactById(id);
    if (!result) throw HttpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function add(req, res, next) {
  try {
    const result = await services.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const result = await services.updateContact(id, req.body);
    if (!result) throw HttpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const result = await services.removeContact(id);
    if (!result) throw HttpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      throw HttpError(400, "Missing field favorite");
    }

    const result = await services.updateStatusContact(id, { favorite });
    if (!result) throw HttpError(404, "Not found");

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
  updateStatus,
};

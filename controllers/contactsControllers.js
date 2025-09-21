const services = require("../services/contactsServices");
const HttpError = require("../helpers/HttpError");

async function getAll(req, res, next) {
  try {
    const { id: owner } = req.user;
    const result = await services.listContacts(owner);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const result = await services.getContactById(id, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function add(req, res, next) {
  try {
    const { id: owner } = req.user;
    const result = await services.addContact(req.body, owner);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const result = await services.removeContact(id, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const result = await services.updateContact(id, req.body, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const { favorite } = req.body;

    if (favorite === undefined) {
      throw HttpError(400, "Missing field favorite");
    }

    const result = await services.updateStatusContact(id, favorite, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  updateStatus,
};

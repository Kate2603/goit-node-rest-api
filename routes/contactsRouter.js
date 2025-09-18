const express = require("express");
const ctrl = require("../controllers/contactsControllers");
const validateBody = require("../helpers/validateBody");
const {
  addContactSchema,
  updateContactSchema,
} = require("../schemas/contactsSchemas");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:id", ctrl.getById);

router.delete("/:id", ctrl.remove);

router.post("/", validateBody(addContactSchema), ctrl.add);

router.put("/:id", validateBody(updateContactSchema), ctrl.update);

module.exports = router;

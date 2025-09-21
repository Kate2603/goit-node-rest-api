const express = require("express");
const ctrl = require("../controllers/contactsControllers");
const auth = require("../middlewares/auth");

const router = express.Router();

router.use(auth);

router.get("/", ctrl.getAll);

router.get("/:id", ctrl.getById);

router.post("/", ctrl.add);

router.put("/:id", ctrl.update);

router.patch("/:id/favorite", ctrl.updateStatus);

router.delete("/:id", ctrl.remove);

module.exports = router;

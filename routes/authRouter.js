const express = require("express");
const ctrl = require("../controllers/authControllers");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.post("/logout", auth, ctrl.logout);

router.get("/current", auth, ctrl.getCurrent);

router.patch("/subscription", auth, ctrl.updateSubscription);

router.patch("/avatars", auth, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;

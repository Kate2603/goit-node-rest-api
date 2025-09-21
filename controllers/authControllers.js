const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");

const HttpError = require("../helpers/HttpError");
const userServices = require("../services/userServices");

const SECRET_KEY = process.env.SECRET_KEY; // беремо лише з .env
const avatarsDir = path.join(__dirname, "../public/avatars");

// ---------------- REGISTER ----------------
async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw HttpError(400, "Validation error");

    const existingUser = await userServices.findUserByEmail(email);
    if (existingUser) throw HttpError(409, "Email in use");

    const hashPassword = await bcrypt.hash(password, 10);

    // генеруємо аватар через gravatar
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

    const newUser = await userServices.createUser({
      email,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- LOGIN ----------------
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw HttpError(400, "Validation error");

    const user = await userServices.findUserByEmail(email);
    if (!user) throw HttpError(401, "Email or password is wrong");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    await userServices.updateUserToken(user.id, token);

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- LOGOUT ----------------
async function logout(req, res, next) {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    await userServices.updateUserToken(req.user.id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// ---------------- CURRENT USER ----------------
async function getCurrent(req, res, next) {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- UPDATE SUBSCRIPTION ----------------
async function updateSubscription(req, res, next) {
  try {
    const { subscription } = req.body;
    if (!["starter", "pro", "business"].includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    const updatedUser = await userServices.updateUserSubscription(
      req.user.id,
      subscription
    );

    res.json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- UPDATE AVATAR ----------------
async function updateAvatar(req, res, next) {
  try {
    if (!req.file) throw HttpError(400, "Avatar file is required");

    const { path: tempPath, originalname } = req.file;
    const { id } = req.user;

    const ext = path.extname(originalname);
    const newFileName = `${id}_${Date.now()}${ext}`;
    const resultPath = path.join(avatarsDir, newFileName);

    await fs.rename(tempPath, resultPath);

    const avatarURL = `/avatars/${newFileName}`;
    const updatedUser = await userServices.updateUserAvatar(id, avatarURL);

    if (!updatedUser) throw HttpError(404, "User not found");

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
};

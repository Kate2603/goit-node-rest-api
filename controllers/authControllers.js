const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/HttpError");
const userServices = require("../services/userServices");

const SECRET_KEY = process.env.SECRET_KEY;

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw HttpError(400, "Validation error");

    const existingUser = await userServices.findUserByEmail(email);
    if (existingUser) throw HttpError(409, "Email in use");

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userServices.createUser({
      email,
      password: hashPassword,
    });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

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

async function logout(req, res, next) {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    await userServices.updateUserToken(req.user.id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getCurrent(req, res, next) {
  try {
    if (!req.user) throw HttpError(401, "Not authorized");

    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

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

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../helpers/HttpError");

const SECRET_KEY = process.env.SECRET_KEY;

// ----------------- REGISTER -----------------
async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw HttpError(400, "Validation error");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------- LOGIN -----------------
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw HttpError(400, "Validation error");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------- LOGOUT -----------------
async function logout(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// ----------------- CURRENT -----------------
async function getCurrent(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const { subscription } = req.body;

    // Перевіряємо, що передане правильне значення
    if (!["starter", "pro", "business"].includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    const user = req.user;
    user.subscription = subscription;
    await user.save();

    res.json({
      email: user.email,
      subscription: user.subscription,
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

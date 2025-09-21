// controllers/authControllers.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../helpers/HttpError");
const userServices = require("../services/userServices");
const sendEmail = require("../services/emailService");

const SECRET_KEY = process.env.SECRET_KEY;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const avatarsDir = path.join(__dirname, "../public/avatars");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw HttpError(400, "Validation error");

    const existingUser = await userServices.findUserByEmail(email);
    if (existingUser) throw HttpError(409, "Email in use");

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const verificationToken = uuidv4();

    const newUser = await userServices.createUser({
      email,
      password: hashPassword,
      avatarURL,
      verify: false,
      verificationToken,
    });

    await sendEmail({
      to: email,
      subject: "Please verify your email ✔",
      html: `<a href="http://localhost:3000/api/auth/verify/${verificationToken}">
        Click here to verify your email
      </a>`,
    });

    const response = {
      user: { email: newUser.email, subscription: newUser.subscription },
      message: "Registration successful, verification email sent",
    };

    if (process.env.NODE_ENV === "development") {
      response.user.verificationToken = verificationToken;
    }

    res.status(201).json(response);
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
    if (!user.verify) throw HttpError(401, "Email not verified");

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
      avatarURL: req.user.avatarURL,
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

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;

    const user = await userServices.findUserByVerificationToken(
      verificationToken
    );
    if (!user) throw HttpError(404, "User not found");

    await userServices.updateUser(user.id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await userServices.findUserByEmail(email);
    if (!user) throw HttpError(404, "User not found");
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendEmail({
      to: email,
      subject: "Verify your email ✔",
      html: `<p>Hi! Confirm your email:</p>
             <p><a href="${BASE_URL}/api/auth/verify/${user.verificationToken}">
               Click here to verify your email
             </a></p>`,
    });

    res.status(200).json({ message: "Verification email sent" });
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
  verifyEmail,
  resendVerificationEmail,
};

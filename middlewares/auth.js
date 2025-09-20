const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../helpers/HttpError");

const SECRET_KEY = process.env.SECRET_KEY;

async function auth(req, res, next) {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw HttpError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(id);

    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
}

module.exports = auth;

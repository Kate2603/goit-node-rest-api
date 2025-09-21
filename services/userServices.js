const User = require("../models/user");

async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function findUserById(id) {
  return await User.findByPk(id);
}

async function findUserByVerificationToken(verificationToken) {
  return await User.findOne({ where: { verificationToken } });
}

async function createUser(data) {
  return await User.create(data);
}

async function updateUser(id, data) {
  const [count, rows] = await User.update(data, {
    where: { id },
    returning: true,
  });
  return count ? rows[0] : null;
}

async function updateUserToken(id, token) {
  return await updateUser(id, { token });
}

async function updateUserSubscription(id, subscription) {
  return await updateUser(id, { subscription });
}

async function updateUserAvatar(id, avatarURL) {
  return await updateUser(id, { avatarURL });
}

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByVerificationToken,
  createUser,
  updateUser,
  updateUserToken,
  updateUserSubscription,
  updateUserAvatar,
};

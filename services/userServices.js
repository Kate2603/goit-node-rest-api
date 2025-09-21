const User = require("../models/user");

async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function createUser(data) {
  return await User.create(data);
}

async function findUserById(id) {
  return await User.findByPk(id);
}

async function updateUserToken(id, token) {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.token = token;
  await user.save();
  return user;
}

async function updateUserSubscription(id, subscription) {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.subscription = subscription;
  await user.save();
  return user;
}

async function updateUserAvatar(id, avatarURL) {
  const [count, users] = await User.update(
    { avatarURL },
    { where: { id }, returning: true }
  );
  return count > 0 ? users[0] : null;
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserToken,
  updateUserSubscription,
  updateUserAvatar,
};

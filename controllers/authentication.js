const bcrypt = require("bcrypt");
const path = require("path");
const Model = require(path.resolve(__dirname, "../models/models.js"));
const database = new Model();

async function authenticateUser(username, password) {
  // const user = await database.user(username);

  // if (!user) {
  //     throw new Error('User not found');
  // }

  // const inputHash = bcrypt.hashSync(password, user.passwordSalt);

  // if (user.passwordHash === inputHash) {
  //     return user;
  // } else {
  //     throw new Error('Invalid credentials');
  // }
  return username;
}

module.exports = {
  authenticateUser,
};

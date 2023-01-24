const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  usertype: String,
});

const user = mongoose.model("users", userSchema);
module.exports = user;

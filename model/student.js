const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gender: String,
  imagepath: String,
});

module.exports = mongoose.model("Stuents", studentSchema);

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  department: String
});

module.exports = mongoose.model("Doctor", doctorSchema);
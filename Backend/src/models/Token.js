const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: Number, unique: true },
  patientName: String,
  patientType: { type: String, enum: ["Walk-in", "Online", "Follow-up", "Paid Priority"], default: "Walk-in" },
  doctorId: mongoose.Schema.Types.ObjectId,
  slotId: mongoose.Schema.Types.ObjectId,
  priority: { type: String, enum: ["Normal", "Priority", "VIP", "Emergency"], default: "Normal" },
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "No-show"],
    default: "Booked"
  },
  cancelledReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Token", tokenSchema);
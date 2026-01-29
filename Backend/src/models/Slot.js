const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  doctorId: mongoose.Schema.Types.ObjectId,
  startTime: String,
  endTime: String,
  maxCapacity: Number,
  currentCount: { type: Number, default: 0 },
  activeTokens: { type: Number, default: 0 },  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

slotSchema.virtual('isFull').get(function() {
  return this.currentCount >= this.maxCapacity;
});

module.exports = mongoose.model("Slot", slotSchema);
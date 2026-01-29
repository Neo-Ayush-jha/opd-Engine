const Slot = require("../models/Slot");
const Token = require("../models/Token");

exports.createSlot = async (req, res) => {
  const slot = await Slot.create(req.body);
  res.json(slot);
};

exports.getSlotsByDoctor = async (req, res) => {
  const slots = await Slot.find({ doctorId: req.params.doctorId });
  res.json(slots);
};

exports.getSlots = async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
};
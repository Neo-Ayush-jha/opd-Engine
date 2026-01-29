const Slot = require("../models/Slot");
const Token = require("../models/Token");

// Get next token number
const getNextTokenNumber = async () => {
  const lastToken = await Token.findOne().sort({ tokenNumber: -1 });
  return (lastToken?.tokenNumber || 0) + 1;
};

// Priority map
const priorityMap = {
  "Normal": "Normal",
  "Priority": "Priority",
  "VIP": "VIP",
  "Emergency": "Emergency"
};

const bookToken = async (data) => {
  const slot = await Slot.findById(data.slotId);
  if (!slot) throw new Error("Slot not found");

  // Check if slot has capacity
  if (slot.currentCount >= slot.maxCapacity) {
    // Only emergency can override
    if (data.priority !== "Emergency") {
      throw new Error("Slot Full");
    }

    // Emergency override: cancel lowest priority token
    const lowPriorityToken = await Token.findOne({
      slotId: slot._id,
      status: "Booked"
    }).sort({ priority: 1 }); // 1 = lowest priority

    if (lowPriorityToken) {
      lowPriorityToken.status = "Cancelled";
      lowPriorityToken.cancelledReason = "Emergency Override - Patient reallocated";
      await lowPriorityToken.save();
      
      // currentCount stays same (one out, one in)
    } else {
      throw new Error("Cannot allocate emergency token - no lower priority token to replace");
    }
  } else {
    // Normal booking - increment currentCount
    slot.currentCount++;
    slot.activeTokens = slot.currentCount;
    slot.updatedAt = new Date();
    await slot.save();
  }

  // Create new token
  const tokenNumber = await getNextTokenNumber();
  
  const newToken = await Token.create({
    tokenNumber,
    patientName: data.patientName,
    patientType: data.patientType || "Walk-in",
    doctorId: data.doctorId,
    slotId: data.slotId,
    priority: data.priority || "Normal",
    status: "Booked"
  });

  return {
    success: true,
    tokenNumber,
    data: newToken,
    message: data.priority === "Emergency" ? "Emergency token allocated!" : "Token booked successfully!"
  };
};

const cancelToken = async (tokenId) => {
  const token = await Token.findById(tokenId);
  if (!token) throw new Error("Token not found");

  // Only cancel if currently booked
  if (token.status !== "Booked") {
    throw new Error("Cannot cancel already " + token.status.toLowerCase() + " token");
  }

  token.status = "Cancelled";
  token.cancelledReason = token.cancelledReason || "User cancelled";
  token.updatedAt = new Date();
  await token.save();

  // Decrease slot count
  const slot = await Slot.findByIdAndUpdate(
    token.slotId,
    {
      $inc: { currentCount: -1, activeTokens: -1 },
      updatedAt: new Date()
    },
    { new: true }
  );

  return {
    success: true,
    data: token,
    message: "Token cancelled successfully",
    updatedSlot: slot
  };
};

const markNoShow = async (tokenId) => {
  const token = await Token.findById(tokenId);
  if (!token) throw new Error("Token not found");

  token.status = "No-show";
  token.updatedAt = new Date();
  await token.save();

  // Decrease slot count
  const slot = await Slot.findByIdAndUpdate(
    token.slotId,
    {
      $inc: { currentCount: -1, activeTokens: -1 },
      updatedAt: new Date()
    },
    { new: true }
  );

  return {
    success: true,
    data: token,
    message: "Token marked as no-show",
    updatedSlot: slot
  };
};

const getTokensBySlot = async (slotId) => {
  const tokens = await Token.find({ slotId, status: "Booked" });
  return tokens;
};

const getSlotStats = async () => {
  const stats = {
    totalSlots: await Slot.countDocuments(),
    fullSlots: await Slot.countDocuments({ $expr: { $gte: ["$currentCount", "$maxCapacity"] } }),
    totalTokens: await Token.countDocuments(),
    bookedTokens: await Token.countDocuments({ status: "Booked" }),
    cancelledTokens: await Token.countDocuments({ status: "Cancelled" }),
    emergencyTokens: await Token.countDocuments({ priority: "Emergency" })
  };
  return stats;
};

module.exports = {
  bookToken,
  cancelToken,
  markNoShow,
  getTokensBySlot,
  getSlotStats
};
module.exports = { bookToken, cancelToken, markNoShow };

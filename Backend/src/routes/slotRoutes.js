const express = require("express");
const router = express.Router();
const {
  createSlot,
  getSlotsByDoctor,
  getSlots
} = require("../controllers/slotController");

router.post("/", createSlot);
router.get("/:doctorId", getSlotsByDoctor);
router.get("/", getSlots);

module.exports = router;

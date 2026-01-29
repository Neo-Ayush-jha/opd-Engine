const {
  bookToken,
  cancelToken,
  markNoShow,
  getTokensBySlot,
  getSlotStats
} = require("../services/tokenService");
const Token = require("../models/Token");

exports.createToken = async (req, res) => {
  try {
    const result = await bookToken(req.body);
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.data,
      tokenNumber: result.tokenNumber
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.cancelToken = async (req, res) => {
  try {
    const result = await cancelToken(req.params.tokenId || req.body.tokenId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.noShowToken = async (req, res) => {
  try {
    const result = await markNoShow(req.params.tokenId || req.body.tokenId);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.getTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: tokens,
      count: tokens.length
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.getTokensBySlot = async (req, res) => {
  try {
    const tokens = await getTokensBySlot(req.params.slotId);
    res.json({
      success: true,
      data: tokens,
      count: tokens.length
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.getTokenStats = async (req, res) => {
  try {
    const stats = await getSlotStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
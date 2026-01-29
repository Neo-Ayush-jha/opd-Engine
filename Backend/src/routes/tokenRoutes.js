const express = require("express");
const router = express.Router();
const {
  createToken,
  cancelToken,
  noShowToken,
  getTokens
} = require("../controllers/tokenController");

router.get("/", getTokens);
router.post("/book", createToken);
router.post("/cancel", cancelToken);
router.post("/noshow", noShowToken);

module.exports = router;

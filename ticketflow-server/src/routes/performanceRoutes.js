const express = require("express");
const {
  getPerformances,
  createPerformance,
} = require("../controllers/performanceController");

const router = express.Router();

router.get("/", getPerformances);
router.post("/", createPerformance);

module.exports = router;

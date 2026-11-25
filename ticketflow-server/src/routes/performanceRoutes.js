const express = require("express");
const {
  getPerformances,
  createPerformance,
  updatePerformance,
} = require("../controllers/performanceController");

const router = express.Router();

router.get("/", getPerformances);
router.post("/", createPerformance);
router.patch("/:id", updatePerformance);

module.exports = router;

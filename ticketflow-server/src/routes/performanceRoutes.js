const express = require("express");
const {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
} = require("../controllers/performanceController");

const router = express.Router();

router.get("/", getPerformances);
router.post("/", createPerformance);
router.patch("/:id", updatePerformance);
router.delete("/:id", deletePerformance);

module.exports = router;

const express = require("express");
const {
  getPerformances,
} = require("../controllers/performanceController");

const router = express.Router();

router.get("/", getPerformances);

module.exports = router;

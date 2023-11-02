const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const fs = require("fs");
const { createExcel } = require("../controllers/userController");
router.get('/generate-excel', createExcel);
exports.router = router;
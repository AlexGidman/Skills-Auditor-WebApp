const app = require("../app");
const controller = require("../controllers/login");
const express = require("express");
const router = express.Router();
const utilities = require("../utilities/utility");

router.post("/", controller.login);
router.get("/validate", utilities.checkToken, (req, res) => res.status(200).json({ valid: true }));

module.exports = router;

const controller = require("../controllers/direct_report");
const express = require("express");
const router = express.Router();

const { checkToken } = require("../utilities/utility");

router.all("*", [checkToken]);

router.get("/:id", controller.getAllReports);
router.post("/", controller.create);
router.delete("/", controller.deleting);

module.exports = router;

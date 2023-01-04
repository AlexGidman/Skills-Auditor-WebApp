const app = require("../app");
const controller = require("../controllers/skill");
const express = require("express");
const router = express.Router();

const { checkToken } = require("../utilities/utility");

router.all("*", [checkToken]);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.delete("/", controller.deleting);
router.put("/", controller.update);

module.exports = router;

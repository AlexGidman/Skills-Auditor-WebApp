const controller = require("../controllers/user_to_skill");
const express = require("express");
const router = express.Router();

const { checkToken } = require("../utilities/utility");

router.all("*", [checkToken]);

router.get("/", controller.getAll);
router.get("/:id", controller.getByStaffskillId);
router.get("/byuser/:id", controller.getByUserId);
router.post("/", controller.create);
router.delete("/", controller.deleting);
router.put("/", controller.update);

module.exports = router;

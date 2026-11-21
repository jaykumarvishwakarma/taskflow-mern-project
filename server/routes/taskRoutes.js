const router = require("express").Router();
const controller = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", controller.getTasks);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.patch("/:id/status", controller.updateStatus);
router.delete("/:id", controller.deleteTask);

module.exports = router;
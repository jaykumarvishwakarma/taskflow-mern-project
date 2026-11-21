const router = require("express").Router();
const controller = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly);
router.get("/overview", controller.overview);
router.delete("/users/:id", controller.deleteUser);
router.delete("/tasks/:id", controller.deleteTask);

module.exports = router;
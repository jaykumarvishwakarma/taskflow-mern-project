const User = require("../models/User");
const Task = require("../models/Task");

exports.overview = async (req, res) => {
  try {
    const [users, tasks] = await Promise.all([
      User.find()
        .select("name email role createdAt")
        .sort({ createdAt: -1 }),
      Task.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 }),
    ]);

    return res.json({ users, tasks });
  } catch (error) {
    console.error("Could not load admin overview:", error);
    return res
      .status(500)
      .json({ message: "Could not load admin overview." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Admin accounts cannot be deleted here." });
    }

    await Promise.all([
      User.findByIdAndDelete(user._id),
      Task.deleteMany({ user: user._id }),
    ]);
    return res.json({ message: "User and their tasks deleted." });
  } catch (error) {
    console.error("Could not delete user:", error);
    return res.status(500).json({ message: "Could not delete user." });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ message: "Task deleted." });
  } catch (error) {
    console.error("Could not delete task:", error);
    return res.status(500).json({ message: "Could not delete task." });
  }
};

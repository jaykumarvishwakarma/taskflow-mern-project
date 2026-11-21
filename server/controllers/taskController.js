const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ tasks });
  } catch (error) {
    console.error("Could not fetch tasks:", error);
    return res.status(500).json({ message: "Could not fetch tasks." });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body || {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Task title is required." });
  }

  try {
    const task = await Task.create({
      title: title.trim(),
      description,
      priority,
      status,
      dueDate: dueDate || null,
      user: req.user._id,
    });
    return res.status(201).json({ task });
  } catch (error) {
    console.error("Could not create task:", error);
    return res
      .status(400)
      .json({ message: "Could not create task. Check the provided values." });
  }
};

exports.updateTask = async (req, res) => {
  const allowedFields = ["title", "description", "priority", "status", "dueDate"];
  const updates = Object.fromEntries(
    Object.entries(req.body || {}).filter(([key]) =>
      allowedFields.includes(key),
    ),
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid task fields provided." });
  }

  if (
    updates.title !== undefined &&
    (typeof updates.title !== "string" || !updates.title.trim())
  ) {
    return res
      .status(400)
      .json({ message: "Task title cannot be empty." });
  }

  if (typeof updates.title === "string") {
    updates.title = updates.title.trim();
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true },
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ task });
  } catch (error) {
    console.error("Could not update task:", error);
    return res
      .status(400)
      .json({ message: "Could not update task. Check the provided values." });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body || {};
  if (!["pending", "in-progress", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid task status." });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true, runValidators: true },
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ task });
  } catch (error) {
    console.error("Could not update task status:", error);
    return res
      .status(500)
      .json({ message: "Could not update task status." });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ message: "Task deleted." });
  } catch (error) {
    console.error("Could not delete task:", error);
    return res.status(500).json({ message: "Could not delete task." });
  }
};

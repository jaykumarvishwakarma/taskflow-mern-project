const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  }

  if (name.trim().length < 2 || name.trim().length > 60) {
    return res
      .status(400)
      .json({ message: "Name must be between 2 and 60 characters." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must contain at least 6 characters." });
  }

  try {
    if (await User.findOne({ email: normalizedEmail })) {
      return res
        .status(409)
        .json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const role =
      adminEmail && normalizedEmail === adminEmail ? "admin" : "user";
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Registration successful.",
      token: createToken(user._id),
      user: safeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Email is already registered." });
    }

    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      token: createToken(user._id),
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Login failed." });
  }
};

exports.me = (req, res) => {
  res.json({ user: safeUser(req.user) });
};
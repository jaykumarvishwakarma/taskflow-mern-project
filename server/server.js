require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const clientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalDevelopmentOrigin(origin) {
  return (
    process.env.NODE_ENV !== "production" &&
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  );
}

app.use(
  cors({
    origin(origin, callback) {
      const allowed =
        !origin ||
        clientOrigins.includes(origin) ||
        isLocalDevelopmentOrigin(origin);
      callback(null, allowed);
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("TaskFlow API is running.");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  await connectDB();

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`TaskFlow server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const leaderboardRoutes = require("./routes/LbRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());  // Allow all origins without credentials for now

app.use(express.json());

// Routes
app.use("/api/leaderboard", (req, res, next) => {
  console.log(`Received request to ${req.method} ${req.url}`);
  next();
}, leaderboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

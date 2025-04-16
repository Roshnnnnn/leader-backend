const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");
const pointsController = require("../controllers/pointsController");

// Create a new Leaderboard entry
router.post("/", leaderboardController.create);

// Retrieve all Leaderboard entries
router.get("/", leaderboardController.findAll);

// Retrieve a single Leaderboard entry by custom ID
router.get("/:id", leaderboardController.findById);

// Add points to user
router.post("/:id/add", pointsController.addPoints);

// Get user's points
router.get("/:id/points", pointsController.getPoints);

// Update a Leaderboard entry by custom ID
router.put("/:id", leaderboardController.update);

// Delete a Leaderboard entry by custom ID
router.delete("/:id", leaderboardController.delete);

// Recalculate leaderboard rankings
router.post("/recalculate", leaderboardController.recalculate);

module.exports = router;

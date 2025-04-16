const Leaderboard = require("../models/leaderboard");

// Function to update rankings
const updateRankings = async () => {
  const entries = await Leaderboard.find().sort({ points: -1 });
  const updates = entries.map((entry, index) => {
    return Leaderboard.findOneAndUpdate(
      { id: entry.id },
      { rank: index + 1 },
      { new: true }
    );
  });
  await Promise.all(updates);
};

// Create new entry
exports.create = async (req, res) => {
  try {
    const entry = await Leaderboard.create(req.body);
    await updateRankings();
    const updatedEntry = await Leaderboard.findOne({ id: entry.id });
    res.status(201).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all entries
exports.findAll = async (req, res) => {
  try {
    const entries = await Leaderboard.find().sort({
      points: -1,
      updatedAt: -1,
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single entry
exports.findOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Find the searched entry
    const searchedEntry = await Leaderboard.findOne({ id });
    if (!searchedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Get all other entries sorted by rank
    const otherEntries = await Leaderboard.find({ id: { $ne: id } }).sort({ rank: 1, id: 1 });

    // Return both searched entry and other entries
    res.json({
      searchedEntry,
      otherEntries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update entry
exports.update = async (req, res) => {
  try {
    const entry = await Leaderboard.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    await updateRankings();
    const updatedEntry = await Leaderboard.findOne({ id: entry.id });
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment points by 20
exports.incrementPoints = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const entry = await Leaderboard.findOneAndUpdate(
      { id },
      { $inc: { points: 20 } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Update rankings after points change
    const entries = await Leaderboard.find().sort({ points: -1 });
    const updates = entries.map((entry, index) => {
      return Leaderboard.findOneAndUpdate(
        { id: entry.id },
        { rank: index + 1 },
        { new: true }
      );
    });
    await Promise.all(updates);

    res.json({
      message: "Points incremented successfully",
      data: entry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete entry
exports.delete = async (req, res) => {
  try {
    const entry = await Leaderboard.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    await updateRankings();
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

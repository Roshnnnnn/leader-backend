const Leaderboard = require("../models/leaderboard");

// Create new entry
exports.create = async (req, res) => {
  try {
    // Find the highest existing ID
    const highestEntry = await Leaderboard.findOne().sort({ id: -1 });
    const nextId = highestEntry ? highestEntry.id + 1 : 1;

    // Get current entries and sort by points to determine rank
    const currentEntries = await Leaderboard.find().sort({ points: -1 });
    
    // Find position for new entry based on points
    const points = req.body.points || 0;
    let initialRank = currentEntries.length + 1;
    for (let i = 0; i < currentEntries.length; i++) {
      if (points >= currentEntries[i].points) {
        initialRank = i + 1;
        break;
      }
    }

    // Create new entry with auto-generated ID and calculated rank
    const entry = await Leaderboard.create({
      name: req.body.name,
      points: points,
      id: nextId,
      rank: initialRank
    });

    // Update ranks for entries below the new entry
    for (let i = 0; i < currentEntries.length; i++) {
      const currentEntry = currentEntries[i];
      if (currentEntry.points <= points) {
        currentEntry.rank = currentEntry.rank + 1;
        await currentEntry.save();
      }
    }

    // Get updated entries sorted by rank and ID
    const updatedEntries = await Leaderboard.find().sort({ rank: 1, id: 1 });
    
    // Return the created entry
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all entries
exports.findAll = async (req, res) => {
  try {
    // Just get entries by ID order (no rank sorting)
    const entries = await Leaderboard.find().sort({ id: 1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single entry by custom ID
exports.findById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Find the searched entry
    const searchedEntry = await Leaderboard.findOne({ id });
    if (!searchedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Get all other entries sorted by ID
    const otherEntries = await Leaderboard.find({ id: { $ne: id } }).sort({ id: 1 });

    // Return both the searched entry and other entries
    res.json({
      searchedEntry,
      otherEntries
    });
  } catch (error) {
    console.error('Error in findById:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update entry by custom ID
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entry = await Leaderboard.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete entry by custom ID
exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entry = await Leaderboard.findOneAndDelete({ id });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Recalculate leaderboard
exports.recalculate = async (req, res) => {
  try {
    console.log('Starting leaderboard recalculation...');
    
    // Get all entries and sort them by points (descending)
    const entries = await Leaderboard.find().sort({ points: -1 });
    console.log(`Found ${entries.length} entries to recalculate`);
    
    // Update ranks for all entries
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      entry.rank = i + 1;
      await entry.save();
      console.log(`Updated rank for user ${entry.name}: ${entry.rank}`);
    }

    // Return entries sorted by points in descending order (rank order)
    const sortedEntries = await Leaderboard.find().sort({ points: -1 });
    console.log('Recalculation completed successfully');
    
    res.json(sortedEntries);
  } catch (error) {
    console.error('Error in recalculate:', error);
    res.status(500).json({ error: error.message });
  }
};

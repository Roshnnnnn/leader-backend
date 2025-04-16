const Leaderboard = require('../models/leaderboard');

// Add points to user
exports.addPoints = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const pointsToAdd = 20;

    if (isNaN(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      });
    }

    const user = await Leaderboard.findOneAndUpdate(
      { id: userId },
      { 
        $inc: { points: pointsToAdd },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: '20 points added successfully',
      totalPoints: user.points
    });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ 
      message: 'Server error while adding points',
      error: error.message
    });
  }
};

// Get user's points
exports.getPoints = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      });
    }

    const user = await Leaderboard.findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      totalPoints: user.points
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ 
      message: 'Server error while fetching points',
      error: error.message
    });
  }
};

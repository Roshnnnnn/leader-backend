const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    id: {
      type: Number,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leaderboard", leaderboardSchema);

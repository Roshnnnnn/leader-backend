const Leaderboard = require('../models/leaderboard');

const names = [
    "John Smith",
    "Emma Wilson",
    "Michael Brown",
    "Sarah Davis",
    "James Johnson",
    "Lisa Anderson",
    "David Miller",
    "Jennifer Taylor",
    "Robert White",
    "Mary Martinez",
    "William Lee",
    "Patricia Garcia",
    "Thomas Moore",
    "Elizabeth Clark",
    "Joseph Rodriguez",
    "Margaret Wilson",
    "Charles Thompson",
    "Susan Martin",
    "Daniel Jackson",
    "Nancy Lewis"
];

const populateData = async () => {
    try {
        // Clear existing data
        await Leaderboard.deleteMany({});

        // Create new entries with random points for testing
        const entries = names.map((name, index) => ({
            name,
            points: Math.floor(Math.random() * 100), // Random points between 0-99 for testing
            rank: 0, // Will be updated after creation
            id: index + 1
        }));

        await Leaderboard.insertMany(entries);

        // Update rankings based on points
        const allEntries = await Leaderboard.find().sort({ points: -1 });
        const updates = allEntries.map((entry, index) => {
            return Leaderboard.findByIdAndUpdate(
                entry._id,
                { rank: index + 1 },
                { new: true }
            );
        });
        await Promise.all(updates);

        console.log('Data populated successfully with rankings!');
    } catch (error) {
        console.error('Error populating data:', error);
    }
};

module.exports = populateData;

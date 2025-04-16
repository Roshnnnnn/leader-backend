const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://roshankumar02yadav:SqlWtSrdpVF2DnPj@cluster0.jt9v8xz.mongodb.net/');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

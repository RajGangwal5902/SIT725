require('dotenv').config({ path: './connectionstring.env' });
const mongoose = require('mongoose');


const mongoURI = process.env.MONGO_URI;


console.log('MongoDB URI:', mongoURI);


const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;

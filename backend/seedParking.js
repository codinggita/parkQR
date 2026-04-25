const mongoose = require('mongoose');
const ParkingSlot = require('./models/ParkingSlot');
const User = require('./models/User');
require('dotenv').config();

const users = [
    { name: 'System Admin', email: 'admin@parksmart.com', password: 'password123', role: 'admin' },
    { name: 'Main Guard', email: 'guard1@parksmart.com', password: 'guardpassword', role: 'guard' }
];

const slots = [
    { slotId: 'A1', slotType: 'Guest', timeLimit: 60 },
    { slotId: 'A2', slotType: 'Guest', timeLimit: 60 },
    { slotId: 'B1', slotType: 'VIP', timeLimit: 120 },
    { slotId: 'C1', slotType: 'Reserved', timeLimit: 480 },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_parking');
        await ParkingSlot.deleteMany();
        await User.deleteMany();
        
        await ParkingSlot.insertMany(slots);
        await User.create(users); // Using create to trigger pre-save hashing
        
        console.log('✅ Production-Level Data Initialized (Users & Slots)');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();

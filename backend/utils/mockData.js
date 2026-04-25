const mongoose = require('mongoose');

// In-memory clones of existing data models for Mock Mode
const mockStore = {
    visitors: [],
    qrPasses: [],
    slots: [
        { _id: 'mock1', slotId: 'A1', slotType: 'Guest', isOccupied: false, timeLimit: 60, duration: 0, isOverstayed: false },
        { _id: 'mock2', slotId: 'A2', slotType: 'Guest', isOccupied: false, timeLimit: 60, duration: 0, isOverstayed: false },
        { _id: 'mock3', slotId: 'VIP1', slotType: 'VIP', isOccupied: false, timeLimit: 120, duration: 0, isOverstayed: false }
    ],
    notifications: [],
    users: [
        { _id: 'm-dev', name: 'Vedant Patel', email: 'vedantpatelxy12@gmail.com', password: 'password123', role: 'admin' },
        { _id: 'm-sahil', name: 'Sahil', email: 'sahil@gmail.com', password: 'password123', role: 'admin' },
        { _id: 'm-admin', name: 'System Admin', email: 'admin@parksmart.com', password: 'password123', role: 'admin' },
        { _id: 'm-guard', name: 'Main Guard', email: 'guard1@parksmart.com', password: 'guardpassword', role: 'guard' }
    ]
};

/**
 * Checks if the database is actually connected
 */
const isDBConnected = () => mongoose.connection.readyState === 1;

module.exports = {
    mockStore,
    isDBConnected
};

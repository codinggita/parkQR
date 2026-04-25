const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, updateDoc } = require('firebase/firestore');

// Using the same config provided by the user for the frontend
const firebaseConfig = {
    apiKey: "AIzaSyBBbHK8uJbUs9VVVS5pCZ1zCiZUfZs_vwE",
    authDomain: "smart-parking-ai-227ed.firebaseapp.com",
    projectId: "smart-parking-ai-227ed",
    storageBucket: "smart-parking-ai-227ed.firebasestorage.app",
    messagingSenderId: "777845693185",
    appId: "1:777845693185:web:199881d712665eeb339900"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Pushes a parking slot update to Firestore.
 * This ensures the Frontend Grid (which listens to Firestore) stays in sync.
 */
const syncSlotToFirestore = async (slot) => {
    try {
        const slotRef = doc(db, "parkingSlots", slot.slotId);
        await setDoc(slotRef, {
            slotId: slot.slotId,
            isOccupied: slot.isOccupied,
            slotType: slot.slotType,
            vehicle: slot.vehicle || '',
            duration: slot.duration || 0,
            timeLimit: slot.timeLimit || 240,
            isOverstayed: slot.isOverstayed || false,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        // console.log(`🔥 Firestore Sync: Slot ${slot.slotId} updated.`);
    } catch (error) {
        console.error('❌ Firestore Sync Error:', error.message);
    }
};

module.exports = { syncSlotToFirestore };

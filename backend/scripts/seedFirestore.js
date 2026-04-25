const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

const slots = [
    { slotId: 'A01', slotType: 'Guest', isOccupied: false },
    { slotId: 'A02', slotType: 'Guest', isOccupied: false },
    { slotId: 'V-01', slotType: 'VIP', isOccupied: false },
    { slotId: 'V-02', slotType: 'VIP', isOccupied: false },
    { slotId: 'B-10', slotType: 'Guest', isOccupied: false },
    { slotId: 'B-11', slotType: 'Guest', isOccupied: false },
    { slotId: 'C-04', slotType: 'Reserved', isOccupied: false },
    { slotId: 'C-05', slotType: 'Reserved', isOccupied: false },
];

const seed = async () => {
    console.log("🚀 Seeding Firestore Facility Layout...");
    for (const slot of slots) {
        await setDoc(doc(db, "parkingSlots", slot.slotId), slot);
        console.log(`✅ Seeded: ${slot.slotId}`);
    }
    console.log("✨ Seeding Complete. Live Grid is now synced with Cloud.");
    process.exit();
};

seed();

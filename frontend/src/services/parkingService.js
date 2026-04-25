import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Real-time listener for parking slots collection
 * @param {Function} callback - Function to handle data updates
 * @returns {Function} - Unsubscribe function for cleanup
 */
export const listenToParkingSlots = (callback) => {
    // 1. Create a query ordered by ID for consistent layout
    const q = query(collection(db, "parkingSlots"), orderBy("slotId", "asc"));

    // 2. Attach real-time listener (onSnapshot)
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const slots = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 3. Structured return via callback
        callback(slots);
    }, (error) => {
        console.error("🔥 Firestore Subscription Failed:", error);
    });

    // 4. Return unsubscribe to be used in useEffect cleanup
    return unsubscribe;
};

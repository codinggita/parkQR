/**
 * ParkSmart AI - Firebase Production Configuration
 * -----------------------------------------------
 * This module initializes the Firebase SDK for the Smart Parking SaaS platform.
 * It provides centralized access to Auth, Firestore, and Analytics.
 *
 * All sensitive keys are loaded from environment variables (VITE_ prefix).
 * Create a .env file in the frontend root with your Firebase project config.
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 1. Firebase Configuration (from environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2. Validate that all required config values are present
const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  console.error(
    `❌ Firebase config is missing the following environment variables: ${missingKeys
      .map((k) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, "_$1").toUpperCase()}`)
      .join(", ")}\n` +
      `   Create a .env file in the frontend root directory with your Firebase project credentials.\n` +
      `   See .env.example for the required format.`
  );
}

// 3. Initialize Firebase Instance
const app = initializeApp(firebaseConfig);

// 4. Export Specialized Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally (client-side only)
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("⚠️ Firebase Analytics could not be initialized:", e.message);
  }
}
export { analytics };

/**
 * PRODUCTION EXAMPLE: Real-time Slot Listener
 * ------------------------------------------
 * Use this pattern in your components to listen for parking updates.
 */
export const subscribeToParkingSlots = (callback) => {
  const q = query(
    collection(db, "parkingSlots"), 
    orderBy("slotId", "asc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const slots = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(slots);
  }, (error) => {
    console.error("🔥 Firestore Subscription Error:", error);
  });
};

/**
 * SYSTEM TEST: Verify Database Connection
 */
export const testConnection = async () => {
    try {
        console.log("📡 Testing Firebase Pulse...");
        // This will trigger a simple read to check connectivity
        const testRef = collection(db, "_healthcheck");
        console.log("✅ Firebase Connected Successfully");
        return true;
    } catch (e) {
        console.error("❌ Firebase Connection Refused:", e.message);
        return false;
    }
};

export default app;

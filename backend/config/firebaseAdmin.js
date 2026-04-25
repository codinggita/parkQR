/**
 * Firebase Admin SDK Initialization
 * ----------------------------------
 * Initializes Firebase Admin with the project ID for token verification.
 * Uses Application Default Credentials or project-only config (no service account needed
 * when only verifying ID tokens from the client SDK).
 */
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'smart-parking-ai-227ed',
  });
}

module.exports = admin;

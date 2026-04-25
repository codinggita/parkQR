import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes (handles page refresh, persistence, etc.)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user role from Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            token: await firebaseUser.getIdToken(),
            // Default to guard if not in db (or admin for specific emails)
            role: docSnap.exists()
              ? docSnap.data().role
              : firebaseUser.email.includes('admin')
                ? 'admin'
                : 'guard',
            name: docSnap.exists()
              ? docSnap.data().name
              : firebaseUser.displayName || firebaseUser.email.split('@')[0],
          };
          setUser(userData);
        } catch (firestoreErr) {
          // Firestore read might fail (rules, offline, etc.) — still log in with basic info
          console.warn('⚠️ Firestore user profile read failed:', firestoreErr.message);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            token: await firebaseUser.getIdToken(),
            role: firebaseUser.email.includes('admin') ? 'admin' : 'guard',
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Maps Firebase Auth error codes to clear, user-friendly messages.
   */
  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      // Credential errors
      'auth/invalid-credential':
        'Invalid email or password. Please double-check and try again.',
      'auth/wrong-password':
        'Incorrect password. Please try again or use "Forgot Password".',
      'auth/user-not-found':
        'No account found with this email. Please check your credentials.',
      'auth/invalid-email':
        'Please enter a valid email address.',

      // Rate limiting
      'auth/too-many-requests':
        'Too many failed attempts. Your account is temporarily locked — please try again later.',

      // Account state
      'auth/user-disabled':
        'This account has been disabled. Contact your administrator.',

      // Configuration issues
      'auth/configuration-not-found':
        'Email/Password sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method and enable it.',
      'auth/api-key-not-valid':
        'Firebase API key is invalid. Please check your .env configuration.',
      'auth/project-not-found':
        'Firebase project not found. Please verify your project ID.',

      // Network
      'auth/network-request-failed':
        'Network error. Please check your internet connection and try again.',
      'auth/internal-error':
        'An internal error occurred. Please try again later.',
    };

    return errorMessages[errorCode] || `Login failed. (${errorCode})`;
  };

  /**
   * Authenticate using Firebase Email/Password sign-in.
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} keepLoggedIn - If true, persist session across browser restarts
   */
  const login = async (email, password, keepLoggedIn = true) => {
    try {
      // Set persistence BEFORE signing in
      await setPersistence(
        auth,
        keepLoggedIn ? browserLocalPersistence : browserSessionPersistence
      );

      // Attempt Firebase sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);

      // onAuthStateChanged will fire and populate the user state
      // But we return immediately so the LoginPage can react
      return { success: true };

    } catch (err) {
      console.error('🔐 Firebase Login Error:', err.code, err.message);
      const friendlyMessage = getAuthErrorMessage(err.code);
      return { success: false, message: friendlyMessage };
    }
  };

  /**
   * Sign out and clear Firebase session
   */
  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will set user to null
    } catch (err) {
      console.error('🔐 Logout Error:', err);
      // Force-clear even if signOut fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

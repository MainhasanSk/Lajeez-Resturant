// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_cJLNrI1i1IOrVIMRj3Z69LhRz0EXK98",
  authDomain: "sb-gold-413e2.firebaseapp.com",
  projectId: "sb-gold-413e2",
  storageBucket: "sb-gold-413e2.firebasestorage.app",
  messagingSenderId: "349858755330",
  appId: "1:349858755330:web:59fb98472126932e77481b",
  measurementId: "G-1RG580PNN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { app, auth, db };

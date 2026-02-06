import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const adminLoginForm = document.getElementById('adminLoginForm');
const errorMessage = document.getElementById('errorMessage');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Handle admin login
adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Verify admin role
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
            errorMessage.textContent = 'Access denied. Admin credentials required.';
            await auth.signOut();
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Access Dashboard</span><i class="fas fa-sign-in-alt"></i>';
            return;
        }
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    } catch (error) {
        errorMessage.textContent = getErrorMessage(error.code);
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').innerHTML = '<span>Access Dashboard</span><i class="fas fa-sign-in-alt"></i>';
    }
});

function getErrorMessage(code) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid admin credentials';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Try again later';
        default:
            return 'Login failed. Please try again';
    }
}

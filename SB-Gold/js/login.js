import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const loginForm = document.getElementById('loginForm');
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

// Handle login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if user is admin
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
            errorMessage.textContent = 'Please use admin login portal';
            await auth.signOut();
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
            return;
        }
        
        window.location.href = 'products.html';
    } catch (error) {
        errorMessage.textContent = getErrorMessage(error.code);
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
    }
});

function getErrorMessage(code) {
    switch (code) {
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Try again later';
        default:
            return 'Login failed. Please try again';
    }
}

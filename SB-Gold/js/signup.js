import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Handle signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        return;
    }
    
    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
        errorMessage.textContent = 'Please enter a valid 10-digit phone number';
        return;
    }
    
    try {
        const signupBtn = document.getElementById('signupBtn');
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile
        await updateProfile(userCredential.user, {
            displayName: name
        });
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: name,
            email: email,
            phone: phone,
            role: 'user',
            favorites: [],
            cart: [],
            createdAt: new Date().toISOString()
        });
        
        // Redirect to products page
        window.location.href = 'products.html';
    } catch (error) {
        errorMessage.textContent = getErrorMessage(error.code);
        document.getElementById('signupBtn').disabled = false;
        document.getElementById('signupBtn').innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
    }
});

function getErrorMessage(code) {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        default:
            return 'Signup failed. Please try again';
    }
}

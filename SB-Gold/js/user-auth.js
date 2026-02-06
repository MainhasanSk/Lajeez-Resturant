import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Toggle between login and signup
showSignupBtn?.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    clearMessages();
});

showLoginBtn?.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    clearMessages();
});

// Password toggle
document.getElementById('togglePassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('loginPassword');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.getElementById('toggleSignupPassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('signupPassword');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Login Form
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    clearMessages();
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Check if user is admin (prevent admin login from user page)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists() && userDoc.data().role === 'admin') {
            showError('Admin accounts cannot login here. Please use Admin Login page.');
            await auth.signOut();
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            return;
        }
        
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        
        let errorMsg = 'Login failed. Please try again.';
        
        if (error.code === 'auth/invalid-email') {
            errorMsg = 'Invalid email address';
        } else if (error.code === 'auth/user-not-found') {
            errorMsg = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
            errorMsg = 'Incorrect password';
        } else if (error.code === 'auth/invalid-credential') {
            errorMsg = 'Invalid email or password';
        }
        
        showError(errorMsg);
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
});

// Signup Form
signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const signupBtn = document.getElementById('signupBtn');
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    clearMessages();
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile
        await updateProfile(user, {
            displayName: name
        });
        
        // Create user document in Firestore (as regular user, not admin)
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            phone: phone,
            role: 'user', // Important: Set as user, not admin
            createdAt: new Date().toISOString(),
            cart: [],
            favorites: []
        });
        
        showSuccess('Account created successfully! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        let errorMsg = 'Signup failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMsg = 'Email already registered. Please login.';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg = 'Invalid email address';
        } else if (error.code === 'auth/weak-password') {
            errorMsg = 'Password is too weak';
        }
        
        showError(errorMsg);
        signupBtn.disabled = false;
        signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function clearMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const adminLoginForm = document.getElementById('adminLoginForm');
const adminErrorMessage = document.getElementById('adminErrorMessage');

// Password toggle
document.getElementById('toggleAdminPassword')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('adminPassword');
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

// Admin Login
adminLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const loginBtn = document.getElementById('adminLoginBtn');
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    adminErrorMessage.style.display = 'none';
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Verify admin role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
            showError('Access denied. Admin privileges required.');
            await auth.signOut();
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
            return;
        }
        
        // Success - redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
        
    } catch (error) {
        console.error('Admin login error:', error);
        
        let errorMsg = 'Login failed. Please check your credentials.';
        
        if (error.code === 'auth/invalid-email') {
            errorMsg = 'Invalid email address';
        } else if (error.code === 'auth/user-not-found') {
            errorMsg = 'Invalid admin credentials';
        } else if (error.code === 'auth/wrong-password') {
            errorMsg = 'Invalid admin credentials';
        } else if (error.code === 'auth/invalid-credential') {
            errorMsg = 'Invalid admin credentials';
        }
        
        showError(errorMsg);
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
    }
});

function showError(message) {
    adminErrorMessage.textContent = message;
    adminErrorMessage.style.display = 'block';
}

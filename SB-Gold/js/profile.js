import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = user;
    updateAuthButton();
    updateCartCount();
    updateFavCount();
    loadProfile();
});

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.textContent = 'Profile';
        authBtn.onclick = () => window.location.href = 'profile.html';
    }
}

async function updateCartCount() {
    if (!currentUser) return;
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const cart = userDoc.data()?.cart || [];
        document.getElementById('cartCount').textContent = cart.length;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateFavCount() {
    if (!currentUser) return;
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const favorites = userDoc.data()?.favorites || [];
        document.getElementById('favCount').textContent = favorites.length;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadProfile() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('profileName').textContent = userData.name;
            document.getElementById('name').value = userData.name;
            document.getElementById('email').value = userData.email;
            document.getElementById('phone').value = userData.phone;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        
        if (!/^[0-9]{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }
        
        await updateDoc(doc(db, 'users', currentUser.uid), {
            name: name,
            phone: phone
        });
        
        document.getElementById('successMessage').textContent = 'Profile updated successfully!';
        setTimeout(() => {
            document.getElementById('successMessage').textContent = '';
        }, 3000);
        
        document.getElementById('profileName').textContent = name;
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
});

// Change password
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorElement = document.getElementById('passwordError');
    const successElement = document.getElementById('passwordSuccess');
    
    errorElement.textContent = '';
    successElement.textContent = '';
    
    if (newPassword !== confirmPassword) {
        errorElement.textContent = 'New passwords do not match';
        return;
    }
    
    if (newPassword.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    try {
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
        
        // Update password
        await updatePassword(currentUser, newPassword);
        
        successElement.textContent = 'Password changed successfully!';
        document.getElementById('passwordForm').reset();
        
        setTimeout(() => {
            successElement.textContent = '';
        }, 3000);
    } catch (error) {
        console.error('Error changing password:', error);
        if (error.code === 'auth/wrong-password') {
            errorElement.textContent = 'Current password is incorrect';
        } else {
            errorElement.textContent = 'Error changing password';
        }
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
});

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('navMenu').classList.toggle('active');
});

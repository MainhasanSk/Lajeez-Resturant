import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  doc, getDoc, updateDoc, arrayRemove, addDoc, collection, arrayUnion 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;
let cartProducts = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = user;
    updateAuthButton();
    updateCartCount();
    updateFavCount();
    loadCart();
    prefillUserData();
});

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser && authBtn) {
        authBtn.textContent = 'Profile';
        authBtn.onclick = () => window.location.href = 'profile.html';
    }
}

async function updateCartCount() {
    if (!currentUser) return;
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const cart = userDoc.data()?.cart || [];
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) cartCountEl.textContent = cart.length;
    } catch (error) {
        console.error('Error loading cart count:', error);
    }
}

async function updateFavCount() {
    if (!currentUser) return;
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const favorites = userDoc.data()?.favorites || [];
        const favCountEl = document.getElementById('favCount');
        if (favCountEl) favCountEl.textContent = favorites.length;
    } catch (error) {
        console.error('Error loading favorites count:', error);
    }
}

async function loadCart() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const cartIds = userDoc.data()?.cart || [];
        
        if (cartIds.length === 0) {
            const cartItemsEl = document.getElementById('cartItems');
            if (cartItemsEl) {
                cartItemsEl.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="products.html" class="btn-primary">Shop Now</a>
                    </div>
                `;
            }
            updateSummary(0, 0);
            return;
        }
        
        cartProducts = [];
        for (const productId of cartIds) {
            const productDoc = await getDoc(doc(db, 'products', productId));
            if (productDoc.exists()) {
                cartProducts.push({
                    id: productId,
                    ...productDoc.data()
                });
            }
        }
        
        displayCart();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function displayCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    container.innerHTML = '';
    
    let totalWeight = 0;
    
    cartProducts.forEach(product => {
        totalWeight += product.weight;
        
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${product.imageURL}" alt="${product.name}">
            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p class="cart-item-meta">${product.purity} • ${product.weight}g • ${product.category || 'Jewelry'}</p>
            </div>
            <button class="btn-remove" onclick="removeFromCart('${product.id}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(item);
    });
    
    updateSummary(cartProducts.length, totalWeight);
}

function updateSummary(itemCount, totalWeight) {
    const itemCountEl = document.getElementById('itemCount');
    const totalWeightEl = document.getElementById('totalWeight');
    if (itemCountEl) itemCountEl.textContent = itemCount;
    if (totalWeightEl) totalWeightEl.textContent = `${totalWeight.toFixed(2)}g`;
}

window.removeFromCart = async (productId) => {
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            cart: arrayRemove(productId)
        });
        await loadCart();
        await updateCartCount();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Prefill user data in checkout form
async function prefillUserData() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const nameEl = document.getElementById('customerName');
            const emailEl = document.getElementById('customerEmail');
            const phoneEl = document.getElementById('customerPhone');
            if (nameEl) nameEl.value = userData.name || '';
            if (emailEl) emailEl.value = userData.email || '';
            if (phoneEl) phoneEl.value = userData.phone || '';
        }
    } catch (error) {
        console.error('Error prefilling data:', error);
    }
}

// ✅ FIXED: Open checkout modal
document.getElementById('inquiryBtn')?.addEventListener('click', () => {
    if (cartProducts.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Show order summary in modal
    const summaryContainer = document.getElementById('checkoutSummary');
    if (summaryContainer) {
        summaryContainer.innerHTML = '';
        
        cartProducts.forEach(product => {
            const item = document.createElement('div');
            item.className = 'summary-item';
            item.innerHTML = `
                <span>${product.name} (${product.weight}g)</span>
                <span>${product.purity}</span>
            `;
            summaryContainer.appendChild(item);
        });
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.style.display = 'flex';
});

// ✅ FIXED: Close modal
document.getElementById('closeCheckoutModal')?.addEventListener('click', () => {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.style.display = 'none';
});

document.getElementById('cancelCheckout')?.addEventListener('click', () => {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.style.display = 'none';
});

// ✅ FIXED COMPLETE: Submit INQUIRY (NOT orders)
document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const btn = document.getElementById('submitOrderBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }
        
        // Collect customer data
        const customerData = {
            name: document.getElementById('customerName')?.value.trim() || '',
            email: document.getElementById('customerEmail')?.value.trim() || '',
            phone: document.getElementById('customerPhone')?.value.trim() || '',
            address: {
                street: document.getElementById('customerAddress')?.value.trim() || '',
                city: document.getElementById('customerCity')?.value.trim() || '',
                state: document.getElementById('customerState')?.value.trim() || '',
                pincode: document.getElementById('customerPincode')?.value.trim() || '',
                landmark: document.getElementById('customerLandmark')?.value.trim() || ''
            },
            notes: document.getElementById('customerNotes')?.value.trim() || ''
        };
        
        // ✅ CORRECT INQUIRY DATA STRUCTURE
        const inquiryData = {
            userId: currentUser.uid,
            customer: customerData,
            items: cartProducts.map(p => ({
                productId: p.id,
                name: p.name,
                purity: p.purity,
                weight: p.weight,
                category: p.category || 'Jewelry',
                imageURL: p.imageURL
            })),
            totalWeight: cartProducts.reduce((sum, p) => sum + p.weight, 0),
            itemCount: cartProducts.length,
            status: 'pending', // pending, viewed, contacted, dismissed
            timestamp: new Date().toISOString(),
            viewedAt: null,
            contactedAt: null,
            dismissedAt: null,
            adminNotes: ''
        };
        
        // ✅ SAVES TO INQUIRIES COLLECTION
        await addDoc(collection(db, 'inquiries'), inquiryData);
        
        // Clear cart
        await updateDoc(doc(db, 'users', currentUser.uid), {
            cart: []
        });
        
        // Close modal
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) checkoutModal.style.display = 'none';
        
        // Show success
        showNotification('✅ Thank you for your inquiry! We will contact you soon.', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error: ' + error.message, 'error');
        const btn = document.getElementById('submitOrderBtn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Inquiry';
        }
    }
});

function showNotification(message, type) {
    const existing = document.querySelector('.notification-popup');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification-popup ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Hamburger menu
document.getElementById('hamburger')?.addEventListener('click', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
});

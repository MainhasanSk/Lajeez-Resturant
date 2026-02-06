import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;
let favoriteProducts = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = user;
    updateAuthButton();
    updateCartCount();
    updateFavCount();
    loadFavorites();
});

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.textContent = 'Profile';
        authBtn.onclick = () => window.location.href = 'profile.html';
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = () => window.location.href = 'login.html';
    }
}

async function updateCartCount() {
    if (!currentUser) {
        document.getElementById('cartCount').textContent = '0';
        return;
    }
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const cart = userDoc.data()?.cart || [];
        document.getElementById('cartCount').textContent = cart.length;
    } catch (error) {
        console.error('Error loading cart count:', error);
    }
}

async function updateFavCount() {
    if (!currentUser) {
        document.getElementById('favCount').textContent = '0';
        return;
    }
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const favorites = userDoc.data()?.favorites || [];
        document.getElementById('favCount').textContent = favorites.length;
    } catch (error) {
        console.error('Error loading favorites count:', error);
    }
}

async function loadFavorites() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const favoriteIds = userDoc.data()?.favorites || [];
        
        if (favoriteIds.length === 0) {
            document.getElementById('favoritesGrid').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <p>No favorites yet</p>
                    <a href="products.html" class="btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }
        
        favoriteProducts = [];
        for (const productId of favoriteIds) {
            const productDoc = await getDoc(doc(db, 'products', productId));
            if (productDoc.exists()) {
                favoriteProducts.push({
                    id: productId,
                    ...productDoc.data()
                });
            }
        }
        
        displayFavorites();
    } catch (error) {
        console.error('Error loading favorites:', error);
        document.getElementById('favoritesGrid').innerHTML = '<p class="error">Error loading favorites</p>';
    }
}

function displayFavorites() {
    const grid = document.getElementById('favoritesGrid');
    grid.innerHTML = '';
    
    favoriteProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.imageURL}" alt="${product.name}">
            <div class="product-badge">${product.purity}</div>
            <button class="btn-favorite-remove" data-product-id="${product.id}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="product-weight"><i class="fas fa-weight"></i> ${product.weight}g • ${product.purity}</p>
            <div class="product-category">${product.category || 'Jewelry'}</div>
            <div class="product-footer">
                <button class="btn-add-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const removeBtn = card.querySelector('.btn-favorite-remove');
    const cartBtn = card.querySelector('.btn-add-cart');
    
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromFavorites(product.id);
    });
    
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id);
    });
    
    return card;
}

async function removeFromFavorites(productId) {
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            favorites: arrayRemove(productId)
        });
        
        showNotification('Removed from favorites', 'success');
        await loadFavorites();
        await updateFavCount();
    } catch (error) {
        console.error('Error removing from favorites:', error);
        showNotification('Error removing from favorites', 'error');
    }
}

async function addToCart(productId) {
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        const cart = userDoc.data()?.cart || [];
        
        if (cart.includes(productId)) {
            showNotification('Item already in cart!', 'error');
            return;
        }
        
        await updateDoc(userRef, {
            cart: arrayUnion(productId)
        });
        
        showNotification('Added to cart!', 'success');
        await updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

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
    }, 2500);
}

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('navMenu').classList.toggle('active');
});

// Contact dropdown
const contactToggle = document.getElementById('contactToggle');
const contactMenu = document.getElementById('contactMenu');

if (contactToggle && contactMenu) {
    contactToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        contactMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!contactToggle.contains(e.target) && !contactMenu.contains(e.target)) {
            contactMenu.classList.remove('show');
        }
    });
}

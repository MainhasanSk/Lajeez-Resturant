import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    query, 
    limit,
    setDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;
let allProducts = [];
let selectedMainCategory = '';
let selectedSubCategory = '';

// ✅ CATEGORY STRUCTURE
const CATEGORIES = {
  'Gold Jewellery': {
    icon: '💍',
    subCategories: ['Chain', 'Finger Ring', 'Earring', 'Necklace', 'Pendant', 'Bangles', 'Bracelet', 'Chain Pendant Set', 'Moti Items', 'Mangalsutra', 'Other']
  },
  'Silver Jewellery': {
    icon: '⚪',
    subCategories: ['Chain', 'Payal', 'Bichiya', 'Baby Bangles', 'Gents Kada', 'Gents Finger Ring', 'Ladies Finger Rings', 'Necklace', 'Other']
  },
  'Diamond Jewellery': {
    icon: '💎',
    subCategories: ['Earring', 'Ladies Finger Ring', 'Gents Finger Rings', 'Bracelet', 'Bangles', 'Necklace', 'Pendant', 'Nosepins', 'Other']
  },
  'Gold Coin': {
    icon: '🪙',
    subCategories: ['22kt Gold Coin', '24kt Gold Coin', 'Other']
  },
  'Silver Utensils': {
    icon: '🍽️',
    subCategories: ['Plate', 'Glass', 'Bowl', 'Spoon', 'Lota', 'Other']
  }
};

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateAuthButton();
    updateCartCount();
    updateFavCount();
});

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.textContent = 'Profile';
        authBtn.onclick = () => window.location.href = 'profile.html';
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = () => window.location.href = 'login.html'; // Original
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

async function loadGoldPrices() {
    try {
        const priceDoc = await getDoc(doc(db, 'goldPrice', 'current'));
        if (priceDoc.exists()) {
            const data = priceDoc.data();
            document.getElementById('price18k').textContent = `₹${data.price18k || 0}/g`;
            document.getElementById('price22k').textContent = `₹${data.price22k || 0}/g`;
            document.getElementById('price24k').textContent = `₹${data.price24k || 0}/g`;
            document.getElementById('makingCharge').textContent = `${data.makingCharge || 0}%`;
        }
    } catch (error) {
        console.error('Error loading gold prices:', error);
    }
}

// ✅ LOAD MAIN CATEGORIES DYNAMICALLY
async function loadMainCategories() {
    const grid = document.getElementById('mainCategoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.keys(CATEGORIES).forEach(categoryName => {
        const categoryData = CATEGORIES[categoryName];
        const categoryCard = document.createElement('a');
        categoryCard.className = 'category-card';
        categoryCard.href = '#';
        categoryCard.innerHTML = `
            <div class="category-icon">${categoryData.icon}</div>
            <h3>${categoryName}</h3>
            <p class="category-count">${categoryData.subCategories.length} Sub-Categories</p>
        `;
        
        categoryCard.addEventListener('click', (e) => {
            e.preventDefault();
            showSubCategories(categoryName);
        });
        
        grid.appendChild(categoryCard);
    });
}

// ✅ SHOW SUB-CATEGORIES
async function showSubCategories(mainCategory) {
    selectedMainCategory = mainCategory;
    selectedSubCategory = '';
    
    const categoryData = CATEGORIES[mainCategory];
    
    // Hide main categories
    const mainCategoriesSection = document.getElementById('mainCategoriesSection');
    if (mainCategoriesSection) mainCategoriesSection.style.display = 'none';
    
    // Hide featured products
    const featuredSection = document.getElementById('featuredSection');
    if (featuredSection) featuredSection.style.display = 'none';
    
    // Show sub-categories
    const subCategoriesSection = document.getElementById('subCategoriesSection');
    if (subCategoriesSection) subCategoriesSection.style.display = 'block';
    
    // Update title
    const titleEl = document.getElementById('selectedCategoryTitle');
    if (titleEl) titleEl.innerHTML = `${categoryData.icon} ${mainCategory}`;
    
    // Load sub-categories
    const subGrid = document.getElementById('subCategoriesGrid');
    if (!subGrid) return;
    
    subGrid.innerHTML = '';
    
    // Add "All" option
    const allCard = document.createElement('div');
    allCard.className = 'sub-category-card active';
    allCard.innerHTML = `
        <i class="fas fa-th"></i>
        <h4>All ${mainCategory}</h4>
    `;
    allCard.addEventListener('click', () => {
        document.querySelectorAll('.sub-category-card').forEach(c => c.classList.remove('active'));
        allCard.classList.add('active');
        selectedSubCategory = '';
        loadCategoryProducts();
    });
    subGrid.appendChild(allCard);
    
    // Add sub-category cards
    categoryData.subCategories.forEach(subCat => {
        const subCard = document.createElement('div');
        subCard.className = 'sub-category-card';
        
        const icon = getSubCategoryIcon(subCat);
        
        subCard.innerHTML = `
            <i class="${icon}"></i>
            <h4>${subCat}</h4>
        `;
        
        subCard.addEventListener('click', () => {
            document.querySelectorAll('.sub-category-card').forEach(c => c.classList.remove('active'));
            subCard.classList.add('active');
            selectedSubCategory = subCat;
            loadCategoryProducts();
        });
        
        subGrid.appendChild(subCard);
    });
    
    // Load products for this category
    loadCategoryProducts();
}

function getSubCategoryIcon(subCategory) {
    const iconMap = {
        'Chain': 'fas fa-link',
        'Finger Ring': 'fas fa-ring',
        'Earring': 'fas fa-gem',
        'Necklace': 'fas fa-necklace',
        'Pendant': 'fas fa-diamond',
        'Bangles': 'fas fa-circle',
        'Bracelet': 'fas fa-bracelet',
        'Payal': 'fas fa-anklet',
        'Plate': 'fas fa-plate-wheat',
        'Glass': 'fas fa-glass-water',
        'Bowl': 'fas fa-bowl-rice',
        'Spoon': 'fas fa-spoon',
        'Lota': 'fas fa-vial',
        '22kt Gold Coin': 'fas fa-coins',
        '24kt Gold Coin': 'fas fa-coins',
        'Nosepins': 'fas fa-gem',
        'Other': 'fas fa-star'
    };
    
    return iconMap[subCategory] || 'fas fa-gem';
}

// ✅ BACK TO MAIN CATEGORIES
document.getElementById('backToMainCategories')?.addEventListener('click', () => {
    const mainCategoriesSection = document.getElementById('mainCategoriesSection');
    if (mainCategoriesSection) mainCategoriesSection.style.display = 'block';
    
    const subCategoriesSection = document.getElementById('subCategoriesSection');
    if (subCategoriesSection) subCategoriesSection.style.display = 'none';
    
    const categoryProductsSection = document.getElementById('categoryProductsSection');
    if (categoryProductsSection) categoryProductsSection.style.display = 'none';
    
    const featuredSection = document.getElementById('featuredSection');
    if (featuredSection) featuredSection.style.display = 'block';
    
    selectedMainCategory = '';
    selectedSubCategory = '';
});

// ✅ LOAD CATEGORY PRODUCTS
async function loadCategoryProducts() {
    try {
        if (allProducts.length === 0) {
            const querySnapshot = await getDocs(collection(db, 'products'));
            allProducts = [];
            
            querySnapshot.forEach((docSnap) => {
                allProducts.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });
        }
        
        let filtered = [...allProducts];
        
        if (selectedMainCategory) {
            filtered = filtered.filter(p => p.mainCategory === selectedMainCategory);
        }
        
        if (selectedSubCategory) {
            filtered = filtered.filter(p => p.subCategory === selectedSubCategory);
        }
        
        // Get user favorites
        let userFavorites = [];
        if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            userFavorites = userDoc.data()?.favorites || [];
        }
        
        // Show category products section
        const categoryProductsSection = document.getElementById('categoryProductsSection');
        if (categoryProductsSection) categoryProductsSection.style.display = 'block';
        
        // Update title
        const titleEl = document.getElementById('categoryProductsTitle');
        const subtitleEl = document.getElementById('categoryProductsSubtitle');
        
        if (selectedSubCategory) {
            if (titleEl) titleEl.textContent = selectedSubCategory;
            if (subtitleEl) subtitleEl.textContent = `${filtered.length} products in ${selectedMainCategory}`;
        } else {
            if (titleEl) titleEl.textContent = selectedMainCategory;
            if (subtitleEl) subtitleEl.textContent = `${filtered.length} products available`;
        }
        
        // Display products
        const grid = document.getElementById('categoryProductsGrid');
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p class="no-data">No products found in this category</p>';
            return;
        }
        
        grid.innerHTML = '';
        filtered.forEach(product => {
            const isFavorite = userFavorites.includes(product.id);
            const productCard = createProductCard(product.id, product, isFavorite);
            grid.appendChild(productCard);
        });
        
    } catch (error) {
        console.error('Error loading category products:', error);
        document.getElementById('categoryProductsGrid').innerHTML = '<p class="error">Error loading products</p>';
    }
}

// ✅ LOAD FEATURED PRODUCTS
async function loadFeaturedProducts() {
    try {
        const productsQuery = query(collection(db, 'products'), limit(9));
        const querySnapshot = await getDocs(productsQuery);
        
        const productsGrid = document.getElementById('featuredProducts');
        
        if (querySnapshot.empty) {
            productsGrid.innerHTML = '<p class="no-data">No products available</p>';
            return;
        }

        productsGrid.innerHTML = '';
        
        let userFavorites = [];
        if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            userFavorites = userDoc.data()?.favorites || [];
        }
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const isFavorite = userFavorites.includes(doc.id);
            const productCard = createProductCard(doc.id, product, isFavorite);
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('featuredProducts').innerHTML = '<p class="error">Error loading products</p>';
    }
}

function createProductCard(id, product, isFavorite) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const heartIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    const heartClass = isFavorite ? 'active' : '';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.imageURL}" alt="${product.name}">
            <div class="product-badge">${product.purity}</div>
            <button class="btn-quick-fav ${heartClass}" data-product-id="${id}">
                <i class="${heartIcon}"></i>
            </button>
        </div>
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="product-weight"><i class="fas fa-weight"></i> ${product.weight}g</p>
            <div class="product-footer">
                <button class="btn-view" onclick="window.location.href='products.html'">
                    View Details
                </button>
                <button class="btn-quick-cart" data-product-id="${id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    
    const favBtn = card.querySelector('.btn-quick-fav');
    const cartBtn = card.querySelector('.btn-quick-cart');
    
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavoriteQuick(id, favBtn);
    });
    
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCartQuick(id, cartBtn);
    });
    
    return card;
}

async function addToCartQuick(productId, btn) {
    if (!currentUser) {
        showNotification('Please login to add items to cart', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        btn.disabled = true;
        
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                cart: [productId],
                favorites: []
            });
            showNotification('Added to cart!', 'success');
            updateCartCount();
            btn.disabled = false;
            return;
        }
        
        const cart = userDoc.data()?.cart || [];
        
        if (cart.includes(productId)) {
            showNotification('Item already in cart!', 'error');
            btn.disabled = false;
            return;
        }
        
        await updateDoc(userRef, {
            cart: arrayUnion(productId)
        });
        
        showNotification('Added to cart!', 'success');
        updateCartCount();
        btn.disabled = false;
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error adding to cart', 'error');
        btn.disabled = false;
    }
}

async function toggleFavoriteQuick(productId, btn) {
    if (!currentUser) {
        showNotification('Please login to add favorites', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        btn.disabled = true;
        
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        const icon = btn.querySelector('i');
        
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                favorites: [productId],
                cart: []
            });
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
            showNotification('Added to favorites!', 'success');
            updateFavCount();
            btn.disabled = false;
            return;
        }
        
        const favorites = userDoc.data()?.favorites || [];
        
        if (favorites.includes(productId)) {
            await updateDoc(userRef, {
                favorites: arrayRemove(productId)
            });
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('active');
            showNotification('Removed from favorites', 'success');
        } else {
            await updateDoc(userRef, {
                favorites: arrayUnion(productId)
            });
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
            showNotification('Added to favorites!', 'success');
        }
        
        updateFavCount();
        btn.disabled = false;
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error updating favorites', 'error');
        btn.disabled = false;
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

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Initialize
loadGoldPrices();
loadMainCategories();
loadFeaturedProducts();

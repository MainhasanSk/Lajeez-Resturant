import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;
let allProducts = [];
let currentProduct = null;
let selectedMainCategory = '';
let selectedSubCategory = '';

// ✅ CATEGORY STRUCTURE WITH ICONS
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
        console.error('Error:', error);
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
        console.error('Error:', error);
    }
}

// ✅ TOAST NOTIFICATION FUNCTION
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(message);
        return;
    }
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ✅ LOAD MAIN CATEGORIES
function loadMainCategories() {
    const grid = document.getElementById('mainCategoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.keys(CATEGORIES).forEach(categoryName => {
        const categoryData = CATEGORIES[categoryName];
        const categoryCard = document.createElement('div');
        categoryCard.className = 'main-category-card';
        categoryCard.innerHTML = `
            <div class="category-icon-large">${categoryData.icon}</div>
            <h3>${categoryName}</h3>
            <p>${categoryData.subCategories.length} Sub-Categories</p>
            <button class="btn-explore">Explore <i class="fas fa-arrow-right"></i></button>
        `;
        
        categoryCard.addEventListener('click', () => {
            showSubCategories(categoryName);
        });
        
        grid.appendChild(categoryCard);
    });
}

// ✅ SHOW SUB-CATEGORIES
function showSubCategories(mainCategory) {
    selectedMainCategory = mainCategory;
    selectedSubCategory = '';
    
    const categoryData = CATEGORIES[mainCategory];
    
    const mainCategoriesSection = document.querySelector('.categories-showcase');
    if (mainCategoriesSection) mainCategoriesSection.style.display = 'none';
    
    const subCategoriesSection = document.getElementById('subCategoriesSection');
    if (subCategoriesSection) subCategoriesSection.style.display = 'block';
    
    const titleEl = document.getElementById('selectedCategoryTitle');
    if (titleEl) titleEl.innerHTML = `${categoryData.icon} ${mainCategory}`;
    
    const subGrid = document.getElementById('subCategoriesGrid');
    if (!subGrid) return;
    
    subGrid.innerHTML = '';
    
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
        loadAndDisplayProducts();
    });
    subGrid.appendChild(allCard);
    
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
            loadAndDisplayProducts();
        });
        
        subGrid.appendChild(subCard);
    });
    
    loadAndDisplayProducts();
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

document.getElementById('backToMainCategories')?.addEventListener('click', () => {
    const mainCategoriesSection = document.querySelector('.categories-showcase');
    if (mainCategoriesSection) mainCategoriesSection.style.display = 'block';
    
    const subCategoriesSection = document.getElementById('subCategoriesSection');
    if (subCategoriesSection) subCategoriesSection.style.display = 'none';
    
    const productsSection = document.getElementById('productsSection');
    if (productsSection) productsSection.style.display = 'none';
    
    const productsFilters = document.getElementById('productsFilters');
    if (productsFilters) productsFilters.style.display = 'none';
    
    selectedMainCategory = '';
    selectedSubCategory = '';
    
    showAllProducts();
});

async function loadAndDisplayProducts() {
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
        
        const purityFilter = document.getElementById('purityFilter')?.value;
        if (purityFilter) {
            filtered = filtered.filter(p => p.purity === purityFilter);
        }
        
        const sortFilter = document.getElementById('sortFilter')?.value;
        switch(sortFilter) {
            case 'weight-low':
                filtered.sort((a, b) => a.weight - b.weight);
                break;
            case 'weight-high':
                filtered.sort((a, b) => b.weight - a.weight);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
        
        if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            const favorites = userDoc.data()?.favorites || [];
            filtered = filtered.map(p => ({
                ...p,
                _isFavorite: favorites.includes(p.id)
            }));
        }
        
        const breadcrumb = document.getElementById('filterBreadcrumb');
        if (breadcrumb) {
            if (selectedSubCategory) {
                breadcrumb.textContent = `${selectedMainCategory} > ${selectedSubCategory}`;
            } else if (selectedMainCategory) {
                breadcrumb.textContent = selectedMainCategory;
            } else {
                breadcrumb.textContent = 'All Products';
            }
        }
        
        const productsSection = document.getElementById('productsSection');
        if (productsSection) productsSection.style.display = 'block';
        
        const productsFilters = document.getElementById('productsFilters');
        if (productsFilters) productsFilters.style.display = 'block';
        
        displayProducts(filtered);
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = '<p class="error">Error loading products</p>';
    }
}

async function showAllProducts() {
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
        
        let productsToShow = [...allProducts];
        
        if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            const favorites = userDoc.data()?.favorites || [];
            productsToShow = productsToShow.map(p => ({
                ...p,
                _isFavorite: favorites.includes(p.id)
            }));
        }
        
        const productsSection = document.getElementById('productsSection');
        if (productsSection) productsSection.style.display = 'block';
        
        const productsFilters = document.getElementById('productsFilters');
        if (productsFilters) productsFilters.style.display = 'block';
        
        const breadcrumb = document.getElementById('filterBreadcrumb');
        if (breadcrumb) breadcrumb.textContent = 'All Products';
        
        displayProducts(productsToShow);
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = '<p class="error">Error loading products</p>';
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p class="no-data">No products found in this category</p>';
        return;
    }
    
    grid.innerHTML = '';
    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
    
    // ✅ ADD EVENT DELEGATION FOR HEART AND CART BUTTONS
    setupProductCardListeners(grid);
}

// ✅ CREATE PRODUCT CARD (WITHOUT inline onclick)
function createProductCard(product) {
    const isFav = currentUser && product._isFavorite;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.imageURL}" alt="${product.name}">
            <div class="product-badge">${product.purity}</div>
            <div class="product-category-badge">${product.subCategory || product.mainCategory}</div>
            <button class="btn-quick-fav ${isFav ? 'active' : ''}" data-action="favorite" data-id="${product.id}">
                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            </button>
        </div>
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="product-weight"><i class="fas fa-weight"></i> ${product.weight}g • ${product.purity}</p>
            <div class="product-footer">
                <button class="btn-view" data-action="view" data-id="${product.id}">
                    View Details
                </button>
                <button class="btn-quick-cart" data-action="cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

// ✅ EVENT DELEGATION FOR PRODUCT CARDS
function setupProductCardListeners(grid) {
    grid.addEventListener('click', async (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.getAttribute('data-action');
        const productId = target.getAttribute('data-id');
        
        e.stopPropagation();
        
        if (action === 'favorite') {
            await toggleFavoriteQuick(productId, target);
        } else if (action === 'cart') {
            await addToCartQuick(productId);
        } else if (action === 'view') {
            await openProductModal(productId);
        }
    });
}

// ✅ TOGGLE FAVORITE (UPDATED)
async function toggleFavoriteQuick(productId, btn) {
    if (!currentUser) {
        showToast('Please login to manage favorites', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        let favorites = [];
        if (userDoc.exists()) {
            favorites = userDoc.data()?.favorites || [];
        }
        
        const icon = btn.querySelector('i');
        
        if (favorites.includes(productId)) {
            await updateDoc(userRef, {
                favorites: arrayRemove(productId)
            });
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('active');
            showToast('Removed from favorites', 'info');
        } else {
            await updateDoc(userRef, {
                favorites: arrayUnion(productId)
            });
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
            showToast('✓ Added to favorites', 'success');
        }
        
        updateFavCount();
        
    } catch (error) {
        console.error('Error updating favorites:', error);
        showToast('Error updating favorites', 'error');
    }
}

// ✅ ADD TO CART (UPDATED)
async function addToCartQuick(productId) {
    if (!currentUser) {
        showToast('Please login to add items to cart', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        let cart = [];
        if (userDoc.exists()) {
            cart = userDoc.data()?.cart || [];
        }
        
        if (cart.includes(productId)) {
            showToast('Item already in cart', 'info');
            return;
        }
        
        await updateDoc(userRef, {
            cart: arrayUnion(productId)
        });
        
        showToast('✓ Added to cart!', 'success');
        updateCartCount();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error adding to cart', 'error');
    }
}

// ✅ OPEN PRODUCT MODAL
async function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('modalProductImage').src = product.imageURL;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPurity').textContent = product.purity;
    document.getElementById('modalProductWeight').textContent = `${product.weight}g`;
    document.getElementById('modalProductDescription').textContent = product.description;
    
    if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const favorites = userDoc.data()?.favorites || [];
        const favoriteBtn = document.getElementById('modalFavoriteBtn');
        
        if (favorites.includes(productId)) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
            favoriteBtn.classList.add('active');
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
            favoriteBtn.classList.remove('active');
        }
    }
    
    document.getElementById('productModal').style.display = 'flex';
}

document.getElementById('modalFavoriteBtn')?.addEventListener('click', async () => {
    if (!currentUser) {
        showToast('Please login to add favorites', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        let favorites = [];
        if (userDoc.exists()) {
            favorites = userDoc.data()?.favorites || [];
        }
        
        if (favorites.includes(currentProduct.id)) {
            await updateDoc(userRef, {
                favorites: arrayRemove(currentProduct.id)
            });
            showToast('Removed from favorites', 'info');
        } else {
            await updateDoc(userRef, {
                favorites: arrayUnion(currentProduct.id)
            });
            showToast('✓ Added to favorites', 'success');
        }
        
        updateFavCount();
        await openProductModal(currentProduct.id);
        
        if (selectedMainCategory) {
            await loadAndDisplayProducts();
        } else {
            await showAllProducts();
        }
    } catch (error) {
        console.error('Error updating favorites:', error);
        showToast('Error updating favorites', 'error');
    }
});

document.getElementById('modalCartBtn')?.addEventListener('click', async () => {
    if (!currentUser) {
        showToast('Please login to add to cart', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        let cart = [];
        if (userDoc.exists()) {
            cart = userDoc.data()?.cart || [];
        }
        
        if (cart.includes(currentProduct.id)) {
            showToast('Item already in cart', 'info');
            return;
        }
        
        await updateDoc(userRef, {
            cart: arrayUnion(currentProduct.id)
        });
        
        showToast('✓ Added to cart!', 'success');
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding to cart', 'error');
    }
});

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
});

document.getElementById('purityFilter')?.addEventListener('change', () => {
    if (selectedMainCategory) {
        loadAndDisplayProducts();
    } else {
        showAllProducts();
    }
});

document.getElementById('sortFilter')?.addEventListener('change', () => {
    if (selectedMainCategory) {
        loadAndDisplayProducts();
    } else {
        showAllProducts();
    }
});

document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('navMenu').classList.toggle('active');
});

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && CATEGORIES[hash]) {
        showSubCategories(hash);
    } else {
        loadMainCategories();
        showAllProducts();
    }
});

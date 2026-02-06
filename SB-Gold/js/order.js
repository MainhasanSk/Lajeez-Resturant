import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
    loadOrders();
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

async function loadOrders() {
    try {
        const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid),
            orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        
        if (querySnapshot.empty) {
            document.getElementById('ordersList').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>No orders yet</p>
                    <a href="products.html" class="btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = '';
        
        querySnapshot.forEach((orderDoc) => {
            const order = orderDoc.data();
            const orderCard = createOrderCard(orderDoc.id, order);
            ordersList.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersList').innerHTML = '<p class="error">Error loading orders</p>';
    }
}

function createOrderCard(orderId, order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const date = new Date(order.timestamp).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const statusClass = order.status || 'pending';
    const statusText = (order.status || 'pending').toUpperCase();
    
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <img src="${item.imageURL}" alt="${item.name}">
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.purity} • ${item.weight}g</p>
                    <span class="order-item-price">₹${item.price.toLocaleString()}</span>
                </div>
            </div>
        `;
    });
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Order #${orderId.substring(0, 8).toUpperCase()}</h3>
                <p class="order-date"><i class="fas fa-calendar"></i> ${date}</p>
            </div>
            <span class="order-status status-${statusClass}">${statusText}</span>
        </div>
        <div class="order-items">
            ${itemsHTML}
        </div>
        <div class="order-footer">
            <div class="order-total">
                <span>Total Amount:</span>
                <span class="order-total-amount">₹${order.totalAmount.toLocaleString()}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('navMenu').classList.toggle('active');
});

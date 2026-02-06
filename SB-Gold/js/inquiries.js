import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  collection, query, where, getDocs, orderBy, doc, getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  currentUser = user;
  updateAuthButton();
  updateCartCount();
  updateFavCount();
  loadInquiries();
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

async function loadInquiries() {
  const container = document.getElementById('inquiriesList');
  
  if (!container) return;
  
  try {
    container.innerHTML = '<div class="loading">Loading inquiries...</div>';
    
    const q = query(
      collection(db, 'inquiries'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No inquiries yet</p>
          <a href="products.html" class="btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = '';
    
    querySnapshot.forEach((docSnap) => {
      const inquiry = docSnap.data();
      const inquiryCard = createInquiryCard(docSnap.id, inquiry);
      container.appendChild(inquiryCard);
    });
    
  } catch (error) {
    console.error('Error loading inquiries:', error);
    
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Database Index Required</h3>
          <p>Please create a Firestore index to view your inquiries.</p>
          <p><strong>Admin Action Required:</strong></p>
          <ol style="text-align: left; max-width: 500px; margin: 20px auto;">
            <li>Go to Firebase Console → Firestore → Indexes</li>
            <li>Create a composite index for collection: <code>inquiries</code></li>
            <li>Fields: <code>userId (Ascending)</code>, <code>timestamp (Descending)</code></li>
            <li>Wait 2-5 minutes for index to build</li>
          </ol>
          <button onclick="location.reload()" class="btn-primary">Refresh Page</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Error Loading Inquiries</h3>
          <p>${error.message}</p>
          <button onclick="location.reload()" class="btn-primary">Try Again</button>
        </div>
      `;
    }
  }
}

function createInquiryCard(id, inquiry) {
  const card = document.createElement('div');
  card.className = 'order-card';
  
  const statusClass = getStatusClass(inquiry.status);
  const statusText = getStatusText(inquiry.status);
  const statusIcon = getStatusIcon(inquiry.status);
  
  card.innerHTML = `
    <div class="order-header">
      <div class="order-info">
        <h3>Inquiry #${id.substring(0, 8).toUpperCase()}</h3>
        <p class="order-date">
          <i class="fas fa-calendar"></i> 
          ${new Date(inquiry.timestamp).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      <div class="order-status ${statusClass}">
        <i class="fas ${statusIcon}"></i> ${statusText}
      </div>
    </div>
    
    <div class="order-items">
      ${inquiry.items.map(item => `
        <div class="order-item">
          <img src="${item.imageURL}" alt="${item.name}">
          <div class="order-item-details">
            <h4>${item.name}</h4>
            <p>${item.purity} • ${item.weight}g • ${item.category}</p>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="order-footer">
      <div class="inquiry-summary">
        <div class="summary-item">
          <i class="fas fa-box"></i>
          <span>${inquiry.itemCount} ${inquiry.itemCount === 1 ? 'Item' : 'Items'}</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-weight"></i>
          <span>${inquiry.totalWeight.toFixed(2)}g Total Weight</span>
        </div>
      </div>
      
      ${inquiry.status === 'viewed' || inquiry.status === 'contacted' ? `
        <p class="status-message">
          <i class="fas fa-info-circle"></i>
          ${inquiry.status === 'viewed' ? 'Our team has viewed your inquiry and will contact you soon!' : 'Our team has contacted you regarding this inquiry.'}
        </p>
      ` : ''}
      
      ${inquiry.status === 'dismissed' ? `
        <p class="status-message dismissed">
          <i class="fas fa-times-circle"></i>
          This inquiry has been closed. Please contact us for more information.
        </p>
      ` : ''}
    </div>
  `;
  
  return card;
}

function getStatusClass(status) {
  const statusClasses = {
    'pending': 'status-pending',
    'viewed': 'status-processing',
    'contacted': 'status-contacted',
    'dismissed': 'status-cancelled'
  };
  return statusClasses[status] || 'status-pending';
}

function getStatusText(status) {
  const statusTexts = {
    'pending': 'Pending Review',
    'viewed': 'Viewed',
    'contacted': 'Contacted',
    'dismissed': 'Dismissed'
  };
  return statusTexts[status] || status;
}

function getStatusIcon(status) {
  const statusIcons = {
    'pending': 'fa-clock',
    'viewed': 'fa-eye',
    'contacted': 'fa-phone-alt',
    'dismissed': 'fa-times-circle'
  };
  return statusIcons[status] || 'fa-question-circle';
}

document.getElementById('hamburger')?.addEventListener('click', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  }
});

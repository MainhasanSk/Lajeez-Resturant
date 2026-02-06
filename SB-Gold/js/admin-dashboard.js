import { auth, db } from './firebase-config.js';
import { 
  onAuthStateChanged, signOut 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, setDoc, getDoc, query, orderBy, where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ✅ ADD YOUR IMGBB API KEY HERE
const IMGBB_API_KEY = 'ec2ff8e5a819b13d7322373aa4a5afa1';

// ✅ CATEGORY STRUCTURE
const CATEGORIES = {
  'Gold Jewellery': ['Chain', 'Finger Ring', 'Earring', 'Necklace', 'Pendant', 'Bangles', 'Bracelet', 'Chain Pendant Set', 'Moti Items', 'Mangalsutra', 'Other'],
  'Silver Jewellery': ['Chain', 'Payal', 'Bichiya', 'Baby Bangles', 'Gents Kada', 'Gents Finger Ring', 'Ladies Finger Rings', 'Necklace', 'Other'],
  'Diamond Jewellery': ['Earring', 'Ladies Finger Ring', 'Gents Finger Rings', 'Bracelet', 'Bangles', 'Necklace', 'Pendant', 'Nosepins', 'Other'],
  'Gold Coin': ['22kt Gold Coin', '24kt Gold Coin', 'Other'],
  'Silver Utensils': ['Plate', 'Glass', 'Bowl', 'Spoon', 'Lota', 'Other']
};

// ✅ PURITY OPTIONS BY CATEGORY
const PURITY_OPTIONS = {
  'Gold Jewellery': ['18K Gold', '22K Gold', '24K Gold'],
  'Gold Coin': ['22K Gold', '24K Gold'],
  'Silver Jewellery': ['925 Silver', '999 Silver'],
  'Silver Utensils': ['925 Silver', '999 Silver'],
  'Diamond Jewellery': ['Diamond', 'Diamond + 18K Gold', 'Diamond + 22K Gold', 'Diamond + 24K Gold', 'Diamond + Platinum']
};

// Global variables
let currentUser = null;
let currentProductId = null;
let currentInquiryId = null;
let currentInquiryData = null;
let currentStatusFilter = 'all';
let uploadedImageURL = '';

// ✅ UPDATE SUB-CATEGORY AND PURITY DROPDOWNS
function updateSubCategories() {
  const mainCategory = document.getElementById('productMainCategory').value;
  const subCategorySelect = document.getElementById('productSubCategory');
  const subCategoryGroup = document.getElementById('subCategoryGroup');
  const puritySelect = document.getElementById('productPurity');
  
  console.log('Updating categories for:', mainCategory); // Debug
  
  // Update Sub-Categories
  if (subCategorySelect && subCategoryGroup) {
    if (mainCategory && CATEGORIES[mainCategory]) {
      subCategoryGroup.style.display = 'block';
      subCategorySelect.innerHTML = '<option value="">Select Sub-Category (Optional)</option>';
      
      CATEGORIES[mainCategory].forEach(subCat => {
        const option = document.createElement('option');
        option.value = subCat;
        option.textContent = subCat;
        subCategorySelect.appendChild(option);
      });
      
      subCategorySelect.required = false;
    } else {
      subCategoryGroup.style.display = 'none';
      subCategorySelect.innerHTML = '<option value="">Select Sub-Category</option>';
    }
  }
  
  // ✅ Update Purity Options
  if (puritySelect) {
    if (mainCategory && PURITY_OPTIONS[mainCategory]) {
      puritySelect.innerHTML = '<option value="">Select Purity/Material</option>';
      
      PURITY_OPTIONS[mainCategory].forEach(purity => {
        const option = document.createElement('option');
        option.value = purity;
        option.textContent = purity;
        puritySelect.appendChild(option);
      });
      
      puritySelect.required = true;
    } else {
      puritySelect.innerHTML = '<option value="">Select Main Category First</option>';
      puritySelect.required = false;
    }
  }
}

// Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'admin-login.html';
    return;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
      await signOut(auth);
      window.location.href = 'admin-login.html';
      return;
    }
    
    currentUser = user;
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) adminNameEl.textContent = user.displayName || userDoc.data().name || 'Admin';
    
    loadDashboardData();
    
  } catch (error) {
    console.error('Error checking admin:', error);
    await signOut(auth);
    window.location.href = 'admin-login.html';
  }
});

// Section navigation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      const targetSection = document.getElementById(`section-${section}`);
      if (targetSection) targetSection.classList.add('active');
      
      const pageTitleEl = document.getElementById('pageTitle');
      if (pageTitleEl && item.querySelector('span')) {
        pageTitleEl.textContent = item.querySelector('span').textContent;
      }
      
      switch (section) {
        case 'dashboard':
          loadDashboardData();
          break;
        case 'products':
          loadProducts();
          break;
        case 'gold-price':
          loadGoldPrices();
          break;
        case 'orders':
          loadOrders('all');
          break;
        case 'users':
          loadUsers();
          break;
      }
    });
  });
  
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.dataset.status;
      loadOrders(status);
    });
  });
  
  // ✅ MAIN CATEGORY CHANGE LISTENER
  const mainCategorySelect = document.getElementById('productMainCategory');
  if (mainCategorySelect) {
    mainCategorySelect.addEventListener('change', () => {
      console.log('Main category changed:', mainCategorySelect.value);
      updateSubCategories();
    });
  }
});

// Dashboard stats
async function loadDashboardData() {
  try {
    const [productsSnap, inquiriesSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, 'products')).catch(() => ({ size: 0 })),
      getDocs(collection(db, 'inquiries')).catch(() => ({ size: 0 })),
      getDocs(collection(db, 'users')).catch(() => ({ size: 0 }))
    ]);
    
    document.getElementById('totalProducts').textContent = productsSnap.size;
    document.getElementById('totalOrders').textContent = inquiriesSnap.size;
    document.getElementById('totalUsers').textContent = usersSnap.size;
    document.getElementById('totalRevenue').textContent = `₹0`;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Products
async function loadProducts() {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    if (querySnapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No products found</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const row = tbody.insertRow();
      row.innerHTML = `
        <td><img src="${product.imageURL || ''}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;" onerror="this.src='https://via.placeholder.com/50?text=No+Image'"></td>
        <td>${product.name || 'N/A'}</td>
        <td>${product.purity || 'N/A'}</td>
        <td>${(product.weight || 0).toFixed(2)}g</td>
        <td>
          <div><strong>${product.mainCategory || 'N/A'}</strong></div>
          ${product.subCategory ? `<small style="color:#666;">${product.subCategory}</small>` : ''}
        </td>
        <td>
          <button class="btn-icon me-1" onclick="editProduct('${docSnap.id}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-danger" onclick="deleteProduct('${docSnap.id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
    });
  } catch (error) {
    console.error('Error loading products:', error);
    const tbody = document.getElementById('productsTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">Error loading products</td></tr>';
  }
}

// ✅ IMAGE UPLOAD TO IMGBB
async function uploadImageToImgBB(imageFile) {
  try {
    if (!IMGBB_API_KEY || IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
      throw new Error('ImgBB API key not configured. Please add your API key in admin-dashboard.js');
    }
    
    if (!imageFile) {
      throw new Error('No image file provided');
    }
    
    const maxSize = 32 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      throw new Error('Image size must be less than 32MB');
    }
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error('Invalid image format. Please use JPG, PNG, GIF, BMP, or WebP');
    }
    
    const progressBar = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) progressBar.style.display = 'block';
    if (progressFill) progressFill.style.width = '10%';
    if (progressText) progressText.textContent = 'Preparing upload...';
    
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
    
    if (progressFill) progressFill.style.width = '30%';
    if (progressText) progressText.textContent = 'Uploading to ImgBB...';
    
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);
    formData.append('name', imageFile.name.replace(/\.[^/.]+$/, ''));
    
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });
    
    if (progressFill) progressFill.style.width = '70%';
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('ImgBB API Error:', result);
      if (result.error && result.error.message) {
        throw new Error('ImgBB Error: ' + result.error.message);
      } else if (result.status && result.status === 400) {
        throw new Error('Invalid API key or request. Please check your ImgBB API key.');
      } else {
        throw new Error('Upload failed with status ' + response.status);
      }
    }
    
    if (result.success && result.data && result.data.url) {
      if (progressFill) progressFill.style.width = '100%';
      if (progressText) progressText.textContent = 'Upload complete!';
      
      setTimeout(() => {
        if (progressBar) progressBar.style.display = 'none';
        if (progressFill) progressFill.style.width = '0';
      }, 1500);
      
      console.log('Image uploaded successfully:', result.data.url);
      return result.data.url;
    } else {
      console.error('Unexpected response format:', result);
      throw new Error('Upload succeeded but no URL returned');
    }
    
  } catch (error) {
    const progressBar = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    if (progressBar) progressBar.style.display = 'none';
    if (progressFill) progressFill.style.width = '0';
    
    console.error('Image upload error:', error);
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid ImgBB API key. Please verify your API key.');
    } else if (error.message.includes('Network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to ImgBB. Please check your internet connection.');
    }
    
    throw error;
  }
}

// ✅ IMAGE PREVIEW
function previewImage(imageFile) {
  if (imageFile && imageFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreview = document.getElementById('imagePreview');
      const imagePreviewContainer = document.getElementById('imagePreviewContainer');
      const previewStatus = document.getElementById('previewStatus');
      
      if (imagePreview) imagePreview.src = e.target.result;
      if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
      if (previewStatus) previewStatus.textContent = 'Image ready to upload';
    };
    reader.readAsDataURL(imageFile);
  }
}

// ✅ FILE UPLOAD HANDLING
document.addEventListener('DOMContentLoaded', () => {
  const productImageFile = document.getElementById('productImageFile');
  const removeImageBtn = document.getElementById('removeImageBtn');
  const fileUploadArea = document.getElementById('fileUploadArea');
  
  if (productImageFile) {
    productImageFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        previewImage(file);
        const imageURL = await uploadImageToImgBB(file);
        uploadedImageURL = imageURL;
        
        const imagePreview = document.getElementById('imagePreview');
        const previewStatus = document.getElementById('previewStatus');
        
        if (imagePreview) imagePreview.src = imageURL;
        if (previewStatus) {
          previewStatus.innerHTML = '<i class="fas fa-check-circle"></i> Upload complete!';
          previewStatus.style.color = '#27ae60';
        }
        
        alert('✅ Image uploaded successfully!');
        
      } catch (error) {
        alert('❌ ' + error.message);
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      }
    });
  }
  
  if (fileUploadArea) {
    fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadArea.classList.add('drag-over');
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
      fileUploadArea.classList.remove('drag-over');
    });
    
    fileUploadArea.addEventListener('drop', async (e) => {
      e.preventDefault();
      fileUploadArea.classList.remove('drag-over');
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        productImageFile.files = dataTransfer.files;
        
        try {
          previewImage(file);
          const imageURL = await uploadImageToImgBB(file);
          uploadedImageURL = imageURL;
          
          const imagePreview = document.getElementById('imagePreview');
          const previewStatus = document.getElementById('previewStatus');
          
          if (imagePreview) imagePreview.src = imageURL;
          if (previewStatus) {
            previewStatus.innerHTML = '<i class="fas fa-check-circle"></i> Upload complete!';
            previewStatus.style.color = '#27ae60';
          }
          
          alert('✅ Image uploaded successfully!');
          
        } catch (error) {
          alert('❌ ' + error.message);
          const imagePreviewContainer = document.getElementById('imagePreviewContainer');
          if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
        }
      }
    });
  }
  
  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
      const imagePreviewContainer = document.getElementById('imagePreviewContainer');
      if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      uploadedImageURL = '';
      if (productImageFile) productImageFile.value = '';
    });
  }
});

// Gold Prices
async function loadGoldPrices() {
  try {
    const priceDoc = await getDoc(doc(db, 'goldPrice', 'current'));
    if (priceDoc.exists()) {
      const data = priceDoc.data();
      document.getElementById('price18k').value = data.price18k || '';
      document.getElementById('price22k').value = data.price22k || '';
      document.getElementById('price24k').value = data.price24k || '';
      document.getElementById('makingCharge').value = data.makingCharge || '';
    }
  } catch (error) {
    console.error('Error loading gold prices:', error);
  }
}

// Gold Price Form
document.getElementById('goldPriceForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const successMsg = document.getElementById('priceSuccessMessage');
  
  try {
    const priceData = {
      price18k: parseInt(document.getElementById('price18k').value) || 0,
      price22k: parseInt(document.getElementById('price22k').value) || 0,
      price24k: parseInt(document.getElementById('price24k').value) || 0,
      makingCharge: parseInt(document.getElementById('makingCharge').value) || 0,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'goldPrice', 'current'), priceData);
    
    if (successMsg) {
      successMsg.textContent = '✅ Gold prices updated successfully!';
      successMsg.style.color = '#27ae60';
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 3000);
    }
  } catch (error) {
    console.error('Error updating prices:', error);
    if (successMsg) {
      successMsg.textContent = '❌ Error: ' + error.message;
      successMsg.style.color = '#e74c3c';
      successMsg.style.display = 'block';
    }
  }
});

// Inquiries
async function loadOrders(statusFilter = 'all') {
  try {
    currentStatusFilter = statusFilter;
    
    let q;
    if (statusFilter === 'all') {
      q = query(collection(db, 'inquiries'), orderBy('timestamp', 'desc'));
    } else {
      q = query(
        collection(db, 'inquiries'),
        where('status', '==', statusFilter),
        orderBy('timestamp', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const tbody = document.getElementById('ordersTableBody');
    
    if (!tbody) return;
    
    if (querySnapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">No inquiries found</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    
    let pendingCount = 0, viewedCount = 0, contactedCount = 0, dismissedCount = 0;
    
    for (const docSnap of querySnapshot.docs) {
      const inquiry = docSnap.data();
      
      switch(inquiry.status) {
        case 'pending': pendingCount++; break;
        case 'viewed': viewedCount++; break;
        case 'contacted': contactedCount++; break;
        case 'dismissed': dismissedCount++; break;
      }
      
      const userName = inquiry.customer?.name || 'Unknown';
      const phone = inquiry.customer?.phone || 'N/A';
      
      const row = tbody.insertRow();
      row.innerHTML = `
        <td class="fw-bold">${docSnap.id.substring(0, 8).toUpperCase()}</td>
        <td>
          <div class="fw-semibold">${userName}</div>
          <small class="text-muted">${phone}</small>
        </td>
        <td>${inquiry.itemCount || 0} items</td>
        <td>${(inquiry.totalWeight || 0).toFixed(1)}g</td>
        <td>${new Date(inquiry.timestamp || Date.now()).toLocaleDateString('en-IN')}</td>
        <td>
          <span class="status-badge status-${inquiry.status || 'pending'} px-3 py-1">
            ${getStatusText(inquiry.status || 'pending')}
          </span>
        </td>
        <td>
          <button class="btn-icon me-2" onclick="viewInquiry('${docSnap.id}')" title="View">
            <i class="fas fa-eye text-primary"></i>
          </button>
          <button class="btn-icon" onclick="downloadInquiryPDF('${docSnap.id}')" title="PDF">
            <i class="fas fa-download text-success"></i>
          </button>
        </td>
      `;
    }
    
    updateFilterBadges(pendingCount, viewedCount, contactedCount, dismissedCount);
    
  } catch (error) {
    console.error('Error loading inquiries:', error);
    const tbody = document.getElementById('ordersTableBody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">Error loading inquiries</td></tr>';
    }
  }
}

// View Inquiry Modal
window.viewInquiry = async (inquiryId) => {
  try {
    currentInquiryId = inquiryId;
    const inquiryDoc = await getDoc(doc(db, 'inquiries', inquiryId));
    
    if (!inquiryDoc.exists()) {
      alert('Inquiry not found');
      return;
    }
    
    currentInquiryData = inquiryDoc.data();
    const inquiry = currentInquiryData;
    
    const detailHTML = `
      <div class="inquiry-section mb-4 pb-4 border-bottom">
        <h4 class="mb-3"><i class="fas fa-info-circle text-warning me-2"></i>Inquiry #${inquiryId.substring(0,8).toUpperCase()}</h4>
        <div class="row">
          <div class="col-md-3"><strong>Status:</strong> <span class="badge bg-${getStatusClass(inquiry.status)}">${getStatusText(inquiry.status)}</span></div>
          <div class="col-md-3"><strong>Date:</strong> ${new Date(inquiry.timestamp).toLocaleString('en-IN')}</div>
          <div class="col-md-3"><strong>Items:</strong> ${inquiry.itemCount || 0}</div>
          <div class="col-md-3"><strong>Total Weight:</strong> ${(inquiry.totalWeight || 0).toFixed(1)}g</div>
        </div>
      </div>
      
      <div class="inquiry-section mb-4 pb-4 border-bottom">
        <h4 class="mb-3"><i class="fas fa-user text-primary me-2"></i>Customer Details</h4>
        <div class="row">
          <div class="col-md-6">
            <strong>Name:</strong> ${inquiry.customer?.name || 'N/A'}<br>
            <strong>Phone:</strong> ${inquiry.customer?.phone || 'N/A'}<br>
            <strong>Email:</strong> ${inquiry.customer?.email || 'N/A'}
          </div>
          <div class="col-md-6">
            <strong>Address:</strong><br>
            <small>${inquiry.customer?.address?.street || ''}, ${inquiry.customer?.address?.city || ''}, 
            ${inquiry.customer?.address?.state || ''} - ${inquiry.customer?.address?.pincode || ''}</small>
          </div>
        </div>
        ${inquiry.customer?.notes ? `<div class="mt-3 p-3 bg-light rounded"><strong>Notes:</strong> ${inquiry.customer.notes}</div>` : ''}
      </div>
      
      <div class="inquiry-section">
        <h4 class="mb-3"><i class="fas fa-boxes text-success me-2"></i>Inquiry Items</h4>
        <div class="row">
          ${inquiry.items?.map(item => `
            <div class="col-md-6 col-lg-4 mb-3">
              <div class="card h-100">
                <img src="${item.imageURL || ''}" class="card-img-top" style="height:120px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/200x120?text=No+Image'">
                <div class="card-body">
                  <h6 class="card-title">${item.name}</h6>
                  <p class="card-text small">
                    <strong>${item.purity}</strong> | 
                    <strong>${item.weight}g</strong> | 
                    ${item.category || 'Jewelry'}
                  </p>
                </div>
              </div>
            </div>
          `).join('') || '<div class="col-12"><p class="text-muted">No items found</p></div>'}
        </div>
      </div>
    `;
    
    const inquiryDetailEl = document.getElementById('inquiryDetail');
    if (inquiryDetailEl) inquiryDetailEl.innerHTML = detailHTML;
    
    updateInquiryButtons(inquiry.status || 'pending');
    
    const inquiryModalEl = document.getElementById('inquiryModal');
    if (inquiryModalEl) inquiryModalEl.style.display = 'flex';
    
    if (inquiry.status === 'pending') {
      setTimeout(() => updateInquiryStatus('viewed'), 500);
    }
    
  } catch (error) {
    console.error('Error viewing inquiry:', error);
    alert('Error: ' + error.message);
  }
};

// Status Buttons
function updateInquiryButtons(status) {
  const viewedBtn = document.getElementById('markViewedBtn');
  const contactedBtn = document.getElementById('markContactedBtn');
  const dismissedBtn = document.getElementById('markDismissedBtn');
  
  if (viewedBtn) viewedBtn.disabled = status !== 'pending';
  if (contactedBtn) contactedBtn.disabled = status === 'dismissed' || status === 'contacted';
  if (dismissedBtn) dismissedBtn.disabled = status === 'dismissed';
}

async function updateInquiryStatus(newStatus) {
  try {
    if (!currentInquiryId) return;
    
    const updateData = { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    if (newStatus === 'viewed') updateData.viewedAt = new Date().toISOString();
    if (newStatus === 'contacted') updateData.contactedAt = new Date().toISOString();
    if (newStatus === 'dismissed') updateData.dismissedAt = new Date().toISOString();
    
    await updateDoc(doc(db, 'inquiries', currentInquiryId), updateData);
    
    alert(`✅ Inquiry marked as ${getStatusText(newStatus)}!`);
    loadOrders(currentStatusFilter);
    
    setTimeout(() => {
      document.getElementById('inquiryModal').style.display = 'none';
      currentInquiryId = null;
    }, 1500);
    
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Error updating status: ' + error.message);
  }
}

document.getElementById('markViewedBtn')?.addEventListener('click', () => updateInquiryStatus('viewed'));
document.getElementById('markContactedBtn')?.addEventListener('click', () => {
  if (confirm('Mark as contacted?')) updateInquiryStatus('contacted');
});
document.getElementById('markDismissedBtn')?.addEventListener('click', () => {
  if (confirm('Dismiss this inquiry?')) updateInquiryStatus('dismissed');
});

// PDF Download
window.downloadInquiryPDF = async (inquiryId) => {
  try {
    if (typeof window.jspdf === 'undefined') {
      alert('PDF library not loaded. Please refresh the page.');
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const inquiryDoc = await getDoc(doc(db, 'inquiries', inquiryId));
    
    if (!inquiryDoc.exists()) {
      alert('Inquiry not found');
      return;
    }
    
    const inquiry = inquiryDoc.data();
    const pdf = new jsPDF();
    
    pdf.setFillColor(212, 175, 55);
    pdf.rect(0, 0, 210, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SB GOLD', 20, 20);
    
    let y = 45;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INQUIRY DETAILS', 20, y);
    
    y += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Inquiry ID: #${inquiryId.substring(0, 8).toUpperCase()}`, 20, y);
    y += 7;
    pdf.text(`Date: ${new Date(inquiry.timestamp).toLocaleDateString('en-IN')}`, 20, y);
    y += 7;
    pdf.text(`Status: ${getStatusText(inquiry.status)}`, 20, y);
    
    y += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('CUSTOMER INFORMATION', 20, y);
    
    y += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${inquiry.customer?.name || 'N/A'}`, 20, y);
    y += 7;
    pdf.text(`Phone: ${inquiry.customer?.phone || 'N/A'}`, 20, y);
    y += 7;
    pdf.text(`Email: ${inquiry.customer?.email || 'N/A'}`, 20, y);
    y += 7;
    pdf.text(`Address: ${inquiry.customer?.address?.street || ''}, ${inquiry.customer?.address?.city || ''}`, 20, y);
    
    y += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('INQUIRY ITEMS', 20, y);
    
    y += 10;
    
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, y - 5, 170, 8, 'F');
    pdf.setFontSize(9);
    pdf.text('Item Name', 25, y);
    pdf.text('Purity', 90, y);
    pdf.text('Weight', 120, y);
    pdf.text('Category', 150, y);
    
    y += 8;
    
    pdf.setFont('helvetica', 'normal');
    inquiry.items?.forEach((item) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.text(item.name?.substring(0, 30) || 'N/A', 25, y);
      pdf.text(item.purity || 'N/A', 90, y);
      pdf.text(`${item.weight || 0}g`, 120, y);
      pdf.text(item.category || 'N/A', 150, y);
      y += 7;
    });
    
    y += 10;
    
    pdf.setFillColor(212, 175, 55);
    pdf.rect(20, y, 170, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL: ${inquiry.itemCount || 0} Items | ${(inquiry.totalWeight || 0).toFixed(1)}g`, 25, y + 8);
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.text('SB Gold Jewelry | Generated: ' + new Date().toLocaleString('en-IN'), 20, 285);
    
    pdf.save(`SB-Gold-Inquiry-${inquiryId.substring(0, 8)}.pdf`);
    
    alert('✅ PDF downloaded successfully!');
    
  } catch (error) {
    console.error('PDF Error:', error);
    alert('Error generating PDF: ' + error.message);
  }
};

// Helper functions
function getStatusText(status) {
  const map = {
    'pending': 'Pending',
    'viewed': 'Viewed', 
    'contacted': 'Contacted',
    'dismissed': 'Dismissed'
  };
  return map[status] || status;
}

function getStatusClass(status) {
  const map = {
    'pending': 'warning',
    'viewed': 'info', 
    'contacted': 'success',
    'dismissed': 'danger'
  };
  return map[status] || 'secondary';
}

function updateFilterBadges(p, v, c, d) {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    const status = tab.dataset.status;
    const originalText = status.charAt(0).toUpperCase() + status.slice(1);
    let count = 0;
    
    if (status === 'pending') count = p;
    if (status === 'viewed') count = v;
    if (status === 'contacted') count = c;
    if (status === 'dismissed') count = d;
    
    if (count > 0 && status !== 'all') {
      tab.textContent = `${originalText} (${count})`;
    } else if (status !== 'all') {
      tab.textContent = originalText;
    }
  });
}

// Users
async function loadUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const tbody = document.getElementById('usersTableBody');
    
    if (!tbody) return;
    
    if (querySnapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">No users found</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    querySnapshot.forEach((docSnap) => {
      const user = docSnap.data();
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${user.name || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.phone || 'N/A'}</td>
        <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'secondary'}">${user.role || 'user'}</span></td>
        <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
      `;
    });
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

// Modal Controls
document.getElementById('closeInquiryModal')?.addEventListener('click', () => {
  document.getElementById('inquiryModal').style.display = 'none';
  currentInquiryId = null;
});

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('productModal').style.display = 'none';
});

document.getElementById('cancelBtn')?.addEventListener('click', () => {
  document.getElementById('productModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target.id === 'inquiryModal') {
    e.target.style.display = 'none';
    currentInquiryId = null;
  }
  if (e.target.id === 'productModal') {
    e.target.style.display = 'none';
  }
});

// Global Functions
window.editProduct = async (id) => {
  try {
    currentProductId = id;
    const productDoc = await getDoc(doc(db, 'products', id));
    const product = productDoc.data();
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productDescription').value = product.description || '';
    
    // ✅ Set main category first
    document.getElementById('productMainCategory').value = product.mainCategory || '';
    
    // ✅ Trigger the update to load sub-categories and purity
    updateSubCategories();
    
    // ✅ Set sub-category and purity after a small delay
    setTimeout(() => {
      if (product.subCategory) {
        document.getElementById('productSubCategory').value = product.subCategory;
      }
      if (product.purity) {
        document.getElementById('productPurity').value = product.purity;
      }
    }, 100);
    
    document.getElementById('productWeight').value = product.weight || '';
    
    // Show existing image
    uploadedImageURL = product.imageURL || '';
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const previewStatus = document.getElementById('previewStatus');
    
    if (imagePreview && product.imageURL) {
      imagePreview.src = product.imageURL;
      if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
      if (previewStatus) previewStatus.textContent = 'Current product image';
    }
    
    document.getElementById('productModal').style.display = 'flex';
  } catch (error) {
    console.error('Edit error:', error);
  }
};

window.deleteProduct = async (id) => {
  if (confirm('Delete this product?')) {
    try {
      await deleteDoc(doc(db, 'products', id));
      loadProducts();
      alert('✅ Product deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
};

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  if (confirm('Are you sure you want to logout?')) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
});

// Mobile menu
document.getElementById('menuToggle')?.addEventListener('click', () => {
  document.getElementById('adminSidebar')?.classList.toggle('mobile-open');
});

// Add Product Button
document.getElementById('addProductBtn')?.addEventListener('click', () => {
  currentProductId = null;
  uploadedImageURL = '';
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
  
  const productImageFile = document.getElementById('productImageFile');
  if (productImageFile) productImageFile.value = '';
  
  // Reset dropdowns
  const subCategoryGroup = document.getElementById('subCategoryGroup');
  if (subCategoryGroup) subCategoryGroup.style.display = 'none';
  
  const puritySelect = document.getElementById('productPurity');
  if (puritySelect) {
    puritySelect.innerHTML = '<option value="">Select Main Category First</option>';
  }
  
  document.getElementById('productModal').style.display = 'flex';
});

// ✅ PRODUCT FORM SUBMIT
document.getElementById('productForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const saveBtn = document.getElementById('saveProductBtn');
  if (!saveBtn) return;
  
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  try {
    if (!currentProductId && !uploadedImageURL) {
      throw new Error('Please upload a product image');
    }
    
    const mainCategory = document.getElementById('productMainCategory').value;
    const subCategory = document.getElementById('productSubCategory').value;
    
    const productData = {
      name: document.getElementById('productName').value.trim(),
      description: document.getElementById('productDescription').value.trim(),
      mainCategory: mainCategory,
      subCategory: subCategory || '',
      category: subCategory ? `${mainCategory} > ${subCategory}` : mainCategory,
      purity: document.getElementById('productPurity').value,
      weight: parseFloat(document.getElementById('productWeight').value),
      imageURL: uploadedImageURL || 'https://via.placeholder.com/400?text=No+Image',
      updatedAt: new Date().toISOString()
    };
    
    if (productData.description.length < 20) {
      throw new Error('Description must be at least 20 characters');
    }
    
    if (currentProductId) {
      await updateDoc(doc(db, 'products', currentProductId), productData);
      alert('✅ Product updated!');
    } else {
      productData.createdAt = new Date().toISOString();
      await addDoc(collection(db, 'products'), productData);
      alert('✅ Product added!');
    }
    
    document.getElementById('productModal').style.display = 'none';
    
    uploadedImageURL = '';
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    
    loadProducts();
    
  } catch (error) {
    console.error('Save error:', error);
    alert('❌ Error: ' + error.message);
  }
  
  saveBtn.disabled = false;
  saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
});

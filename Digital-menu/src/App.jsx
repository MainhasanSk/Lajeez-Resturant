
import React, { useState, useEffect } from 'react';
import { categories, products } from './data/menuData';
import CategoryGrid from './components/CategoryGrid';
import ProductList from './components/ProductList';
import CartFloating from './components/CartFloating';
import OrderModal from './components/OrderModal';
import SuccessScreen from './components/SuccessScreen';
import './styles/main.css';

// Restaurant Phone Number (Replace with actual number)
const RESTAURANT_PHONE = '919876543210';

function App() {
  const [activeCategory, setActiveCategory] = useState('snacks');
  const [cart, setCart] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Search Logic
  const filteredProducts = searchTerm
    ? Object.values(products).flat().filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : products[activeCategory] || [];

  // Cart Management
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing.quantity === 1) {
        return prev.filter(item => item.id !== product.id);
      }
      return prev.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // WhatsApp Logic
  const handlePlaceOrder = (orderDetails) => {
    const { tableNumber, waterBottle, instructions, grandTotal } = orderDetails;

    let message = `*New Table Order*\n`;
    message += `Table No: ${tableNumber}\n\n`;

    cart.forEach(item => {
      message += `${item.name} × ${item.quantity} – ₹${item.price * item.quantity}\n`;
    });

    if (waterBottle > 0) {
      message += `Water Bottle × ${waterBottle} – ₹${waterBottle * 20}\n`;
    }

    if (instructions) {
      message += `\nNote: ${instructions}\n`;
    }

    message += `\n*Total: ₹${grandTotal}*`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_PHONE}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show success screen
    setIsOrderModalOpen(false);
    setShowSuccess(true);

    // Clear cart after delay or immediately? 
    // Usually better to keep it until confirmed, but for this flow:
    setCart([]);
  };

  return (
    <div className="app-container">
      {showSuccess && <SuccessScreen />}

      <header className="header">
        <h1 className="text-gold">Taj Royal</h1>
        <p className="subtitle">Authentic Indian Cuisine</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      {!searchTerm && (
        <CategoryGrid
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      )}

      <main className="container">
        <h2 className="section-title text-gold mt-4 mb-2">
          {searchTerm ? `Search Results (${filteredProducts.length})` : categories.find(c => c.id === activeCategory)?.name}
        </h2>

        {filteredProducts.length > 0 ? (
          <ProductList
            products={filteredProducts}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
          />
        ) : (
          <p className="text-center text-gold mt-4">No items found.</p>
        )}
      </main>

      <CartFloating
        cart={cart}
        onOpenModal={() => setIsOrderModalOpen(true)}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onConfirm={handlePlaceOrder}
      />

      <style>{`
        .header {
          text-align: center;
          padding: var(--spacing-lg) 0 var(--spacing-md);
          background-color: var(--color-bg);
          position: sticky;
          top: 0;
          z-index: 200;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 4px;
        }
        
        .subtitle {
          color: var(--color-text-secondary);
          font-style: italic;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .search-container {
          padding: 0 var(--spacing-md);
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          border-radius: 24px;
          border: 1px solid var(--color-border);
          background-color: var(--color-surface);
          color: var(--color-text-main);
          font-size: 16px;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        
        .mt-4 { margin-top: 16px; }
        .mb-2 { margin-bottom: 8px; }
        
        .section-title {
          border-left: 4px solid var(--color-primary);
          padding-left: 12px;
        }
      `}</style>
    </div>
  );
}

export default App;

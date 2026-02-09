
import React from 'react';
// import { FaCartShopping } from 'react-icons/fa6';
import '../styles/main.css';

const CartFloating = ({ cart, onOpenModal }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems === 0) return null;

  return (
    <div className="cart-floating fade-in">
      <div className="cart-content">
        <div className="cart-info">
          <div className="cart-count">
            <span className="count-badge">{totalItems}</span>
            <span className="text-sm">ITEMS</span>
          </div>
          <div className="cart-total">
            ₹{totalPrice}
          </div>
        </div>
        <button className="place-order-btn" onClick={onOpenModal}>
          Place Order <span style={{ marginLeft: '8px' }}>🛒</span>
        </button>
      </div>

      <style>{`
        .cart-floating {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 500px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-sm) var(--spacing-md);
          box-shadow: var(--shadow-md);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, 0); }
        }
        
        .cart-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .cart-info {
          display: flex;
          flex-direction: column;
        }
        
        .cart-count {
          color: var(--color-text-secondary);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .count-badge {
          background-color: var(--color-primary);
          color: #000;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 10px;
        }
        
        .cart-total {
          font-size: 18px;
          font-weight: bold;
          color: var(--color-text-main);
        }
        
        .place-order-btn {
          background-color: var(--color-primary);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: bold;
          display: flex;
          align-items: center;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        
        .place-order-btn:hover {
          background-color: var(--color-primary-dark);
        }
      `}</style>
    </div>
  );
};

export default CartFloating;

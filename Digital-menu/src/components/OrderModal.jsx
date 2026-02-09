
import React, { useState } from 'react';
// import { FaXmark } from 'react-icons/fa6';
import '../styles/main.css';

const OrderModal = ({ isOpen, onClose, cart, onAdd, onRemove, onConfirm }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [waterBottle, setWaterBottle] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const totalFoodPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const waterPrice = 20; // Assuming 20 per bottle
  const totalWaterPrice = waterBottle * waterPrice;
  const grandTotal = totalFoodPrice + totalWaterPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setError('Table number is required');
      return;
    }
    setError('');

    // Pass raw data
    onConfirm({
      tableNumber,
      waterBottle,
      instructions,
      grandTotal
    });
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Your Order</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="order-summary-list">
          {cart.length === 0 ? (
            <p className="text-center text-secondary">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-details">
                  <div className="summary-name">{item.name}</div>
                  <div className="summary-price">₹{item.price * item.quantity}</div>
                </div>
                <div className="summary-actions">
                  <div className="qty-control-xs">
                    <button type="button" onClick={() => onRemove(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onAdd(item)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="divider"></div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label>Table Number <span className="text-danger">*</span></label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Ex: 5"
              className="form-input"
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="form-group row">
            <label>Water Bottle (+₹{waterPrice})</label>
            <div className="qty-control-sm">
              <button type="button" onClick={() => setWaterBottle(Math.max(0, waterBottle - 1))}>-</button>
              <span>{waterBottle}</span>
              <button type="button" onClick={() => setWaterBottle(waterBottle + 1)}>+</button>
            </div>
          </div>

          <div className="form-group">
            <label>Special Instructions (Optional)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Less spicy, extra onions, etc."
              className="form-textarea"
              rows="2"
            />
          </div>

          <div className="grand-total">
            <span>Total Payable:</span>
            <span className="text-gold">₹{grandTotal}</span>
          </div>

          <button type="submit" className="confirm-btn">
            Send to Kitchen (WhatsApp)
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: var(--spacing-md);
        }
        
        .modal-content {
          background-color: var(--color-surface);
          width: 100%;
          max-width: 450px;
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--color-border);
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--spacing-sm);
        }
        
        .close-btn {
          color: var(--color-text-secondary);
          font-size: 20px;
        }
        
        .order-summary-list {
          margin-bottom: var(--spacing-md);
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 8px;
        }

        .summary-details {
          flex: 1;
        }

        .summary-name {
          font-weight: 500;
          color: var(--color-text-main);
        }

        .summary-price {
          font-size: 12px;
          color: var(--color-primary);
        }
        
        .qty-control-xs {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-bg);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          margin-left: 10px;
        }
        
        .qty-control-xs button {
          color: var(--color-primary);
          font-weight: bold;
          font-size: 16px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .qty-control-xs span {
            font-size: 12px;
            min-width: 16px;
            text-align: center;
        }
        
        .divider {
          height: 1px;
          background-color: var(--color-border);
          margin: var(--spacing-md) 0;
        }
        
        .form-group {
          margin-bottom: var(--spacing-md);
        }
        
        .form-group.row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: var(--color-text-secondary);
        }
        
        .form-input, .form-textarea {
          width: 100%;
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          color: var(--color-text-main);
          padding: 10px;
          border-radius: var(--radius-md);
          font-family: inherit;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        
        .error-text {
          color: var(--color-danger);
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
        
        .qty-control-sm {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-bg);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
        
        .qty-control-sm button {
          color: var(--color-primary);
          font-weight: bold;
          font-size: 18px;
        }
        
        .grand-total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: bold;
          margin: var(--spacing-lg) 0;
          border-top: 1px solid var(--color-border);
          padding-top: var(--spacing-md);
        }
        
        .confirm-btn {
          width: 100%;
          background-color: var(--color-success);
          color: #fff;
          padding: 14px;
          border-radius: var(--radius-md);
          font-weight: bold;
          font-size: 16px;
        }
        
        .text-danger { color: var(--color-danger); }
      `}</style>
    </div>
  );
};

export default OrderModal;

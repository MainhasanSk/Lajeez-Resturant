
import React from 'react';
// import { FaPlus, FaMinus } from 'react-icons/fa6';
import '../styles/main.css';

const ProductItem = ({ product, quantity, onAdd, onRemove }) => {
  return (
    <div className="product-card fade-in">
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-desc">{product.description}</p>}
        <div className="product-price">₹{product.price}</div>
      </div>

      <div className="product-action">
        {quantity > 0 ? (
          <div className="quantity-control">
            <button onClick={() => onRemove(product)} className="qty-btn remove">-</button>
            <span className="qty-val">{quantity}</span>
            <button onClick={() => onAdd(product)} className="qty-btn add">+</button>
          </div>
        ) : (
          <button onClick={() => onAdd(product)} className="add-btn">
            ADD
          </button>
        )}
      </div>

      <style>{`
        .product-card {
          background-color: var(--color-surface);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid var(--color-border);
        }
        
        .product-info {
          flex: 1;
          padding-right: var(--spacing-md);
        }
        
        .product-name {
          font-size: 16px;
          margin-bottom: 4px;
          color: var(--color-text-main);
        }
        
        .product-desc {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-bottom: 4px;
        }
        
        .product-price {
          font-weight: bold;
          color: var(--color-primary);
        }
        
        .add-btn {
          background-color: transparent;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          font-weight: bold;
          transition: all 0.2s;
        }
        
        .add-btn:active {
          background-color: var(--color-primary);
          color: #000;
        }
        
        .quantity-control {
          display: flex;
          align-items: center;
          background-color: var(--color-bg);
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-primary);
          overflow: hidden;
        }
        
        .qty-btn {
          padding: 6px 10px;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .qty-btn:active {
          background-color: rgba(212, 175, 55, 0.2);
        }
        
        .qty-val {
          padding: 0 8px;
          font-weight: bold;
          min-width: 24px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

const ProductList = ({ products, cart, onAdd, onRemove }) => {
  const getQuantity = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="product-list-container">
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          quantity={getQuantity(product.id)}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
      <div style={{ height: '80px' }}></div> {/* Spacer for floating cart */}
    </div>
  );
};

export default ProductList;

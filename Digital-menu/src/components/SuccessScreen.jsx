
import React from 'react';
// import { FaCheckCircle } from 'react-icons/fa6';
import '../styles/main.css';

const SuccessScreen = () => {
  return (
    <div className="success-screen fade-in">
      <div className="success-content text-center">
        <div className="icon-wrapper">
          <div className="success-icon">✓</div>
        </div>
        <h2>Order Sent Successfully!</h2>
        <p>Your order has been sent to the kitchen via WhatsApp.</p>
        <p className="sub-text">Please wait at your table.</p>

        <button onClick={() => window.location.reload()} className="btn-primary mt-4">
          Place Another Order
        </button>
      </div>

      <style>{`
        .success-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--color-bg);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
        }
        
        .success-content {
          max-width: 400px;
        }
        
        .icon-wrapper {
          margin-bottom: var(--spacing-lg);
        }
        
        .success-icon {
          font-size: 80px;
          color: var(--color-success);
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .success-screen h2 {
          color: var(--color-primary);
          margin-bottom: var(--spacing-md);
        }
        
        .success-screen p {
          color: var(--color-text-main);
          margin-bottom: var(--spacing-sm);
        }
        
        .sub-text {
          color: var(--color-text-secondary);
          font-size: 14px;
        }
        
        .mt-4 { margin-top: 24px; }
      `}</style>
    </div>
  );
};

export default SuccessScreen;

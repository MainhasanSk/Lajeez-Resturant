
import React from 'react';
import '../styles/main.css';

const CategoryGrid = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="category-section">
      <h2 className="text-center text-gold fade-in" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Browse Menu</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-item-card ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="category-img-wrapper">
              <img src={cat.image} alt={cat.name} className="category-img" />
            </div>
            <span className="category-name-small">{cat.name}</span>
          </div>
        ))}
      </div>

      <style>{`
        .category-section {
          padding: 12px;
          background-color: var(--color-surface);
        }
        
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* 4 items per row on mobile */
          gap: 10px;
          justify-items: center;
        }

        @media (min-width: 600px) {
            .category-grid {
                grid-template-columns: repeat(6, 1fr);
            }
        }
        
        .category-item-card {
           display: flex;
           flex-direction: column;
           align-items: center;
           cursor: pointer;
           width: 100%;
           transition: transform 0.2s;
        }

        .category-item-card:active {
            transform: scale(0.95);
        }

        .category-img-wrapper {
            width: 100%;
            aspect-ratio: 1; /* Square box */
            border-radius: 8px; /* Rounded rectangle */
            overflow: hidden;
            margin-bottom: 5px;
            border: 2px solid transparent;
            box-shadow: var(--shadow-sm);
        }

        .category-item-card.active .category-img-wrapper {
            border-color: var(--color-primary);
            box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }

        .category-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .category-name-small {
            font-size: 11px;
            text-align: center;
            line-height: 1.2;
            color: var(--color-text-secondary);
            font-weight: 500;
        }
        
        .category-item-card.active .category-name-small {
            color: var(--color-primary);
            font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default CategoryGrid;

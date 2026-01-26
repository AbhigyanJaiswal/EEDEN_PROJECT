import React from 'react';
import { Product } from '@constants/products';
import { useCartStore } from '@context/cartStore';
import { announceToScreenReader } from '@utils/accessibility/a11y';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });

    announceToScreenReader(`${product.name} added to cart`);
    setIsAdded(true);

    // Reset after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>

      <div className="product-content">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>

          {product.inStock ? (
            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label={`Decrease ${product.name} quantity`}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  aria-label={`${product.name} quantity`}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label={`Increase ${product.name} quantity`}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`add-to-cart-button ${isAdded ? 'added' : ''}`}
                aria-label={`Add ${product.name} to cart`}
              >
                {isAdded ? '✓ Added' : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <button className="out-of-stock-button" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

import React from 'react';
import { Product } from '@constants/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <section className="products-section">
      <h2>Our Collections</h2>
      <div className="products-grid" role="region" aria-label="Product list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

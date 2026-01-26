export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Eco Cotton T-Shirt',
    description: 'Made from 100% organic cotton. Breathable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    inStock: true,
  },
  {
    id: '2',
    name: 'Sustainable Denim Jacket',
    description: 'Classic denim jacket made from recycled materials. Timeless style.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
    category: 'Outerwear',
    inStock: true,
  },
  {
    id: '3',
    name: 'Organic Hemp Shorts',
    description: 'Lightweight hemp shorts perfect for summer. Eco-friendly comfort.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    category: 'Clothing',
    inStock: true,
  },
  {
    id: '4',
    name: 'Bamboo Fiber Dress',
    description: 'Elegant dress made from sustainable bamboo fiber. Silky smooth.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1595777707802-f3ee17e34f5e?w=400&h=400&fit=crop',
    category: 'Dresses',
    inStock: true,
  },
  {
    id: '5',
    name: 'Recycled Wool Sweater',
    description: 'Cozy sweater from 100% recycled wool. Warm and sustainable.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1578932750294-708c3a1b1df1?w=400&h=400&fit=crop',
    category: 'Clothing',
    inStock: true,
  },
  {
    id: '6',
    name: 'Linen Summer Shirt',
    description: 'Breathable linen shirt for warm days. Classic and versatile.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1596399579883-90a2f70bc0a4?w=400&h=400&fit=crop',
    category: 'Clothing',
    inStock: true,
  },
  {
    id: '7',
    name: 'Eco-Friendly Leather Boots',
    description: 'Premium vegan leather boots. Durable and cruelty-free.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Footwear',
    inStock: true,
  },
  {
    id: '8',
    name: 'Sustainable Canvas Bag',
    description: 'Durable canvas tote bag perfect for shopping. Eco-conscious choice.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    inStock: true,
  },
];

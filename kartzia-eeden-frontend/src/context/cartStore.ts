import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (item: CartItem) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        const updated = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        return {
          items: updated,
          total: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };
      }
      const newItems = [...state.items, item];
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    });
  },

  removeItem: (itemId: string) => {
    set((state) => {
      const updated = state.items.filter((i) => i.id !== itemId);
      return {
        items: updated,
        total: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    set((state) => {
      const updated = state.items
        .map((i) => (i.id === itemId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      return {
        items: updated,
        total: updated.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    });
  },

  clearCart: () => set({ items: [], total: 0 }),

  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  getTotal: () => get().total,
}));

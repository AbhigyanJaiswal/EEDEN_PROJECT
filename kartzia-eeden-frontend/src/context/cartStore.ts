import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// BUG FIX: compute total inline instead of calling getTotal() before state is committed
const computeTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      total: 0,

      addItem: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const updatedItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            : [...state.items, item];
          // BUG FIX: total computed from the NEW items array, not the old state
          return { items: updatedItems, total: computeTotal(updatedItems) };
        }),

      removeItem: (id: string) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return { items: updatedItems, total: computeTotal(updatedItems) };
        }),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          return { items: updatedItems, total: computeTotal(updatedItems) };
        }),

      clearCart: () => set({ items: [], total: 0 }),

      getTotal: () => {
        const state = get();
        return computeTotal(state.items);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

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
  // NOTE: `total` is kept as derived state for convenience, but it is NOT
  // persisted — see partialize below. It is always recomputed from items.
  total: number;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const computeTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item: CartItem) =>
        set((state) => {
          const qty = Math.max(1, item.quantity ?? 1);
          const existing = state.items.find((i) => i.id === item.id);
          const updatedItems = existing
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
              )
            : [...state.items, { ...item, quantity: qty }];
          return { items: updatedItems, total: computeTotal(updatedItems) };
        }),

      removeItem: (id: string) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return { items: updatedItems, total: computeTotal(updatedItems) };
        }),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => {
          const safeQty = Math.max(1, quantity);
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity: safeQty } : item
          );
          return { items: updatedItems, total: computeTotal(updatedItems) };
        }),

      clearCart: () => set({ items: [], total: 0 }),

      getTotal: () => computeTotal(get().items),

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      // FIX: only persist `items` — total is always recomputed on hydration.
      // Without this, a stale `total` from localStorage would be used on first
      // render before items are loaded, showing the wrong number.
      partialize: (state) => ({ items: state.items }),
      // After hydrating items, recompute total immediately so it's never stale.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.total = computeTotal(state.items);
        }
      },
    }
  )
);

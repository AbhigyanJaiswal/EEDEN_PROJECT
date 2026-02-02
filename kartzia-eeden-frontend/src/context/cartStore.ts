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

export const useCartStore = create<CartState>()(
  persist(
    (set: any, get: any) => {
      return {
        items: [] as CartItem[],
        total: 0,

        addItem: (item: CartItem) =>
          set((state: CartState) => {
            const existingItem = state.items.find((i: CartItem) => i.id === item.id);
            let updatedItems;

            if (existingItem) {
              updatedItems = state.items.map((i: CartItem) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              );
            } else {
              updatedItems = [...state.items, item];
            }

            return { items: updatedItems, total: get().getTotal() };
          }),

      removeItem: (id: string) =>
        set((state: CartState) => {
          const updatedItems = state.items.filter((item: CartItem) => item.id !== id);
          return { items: updatedItems, total: get().getTotal() };
        }),

      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => {
          const updatedItems = state.items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          return { items: updatedItems, total: get().getTotal() };
        }),

      clearCart: () => set({ items: [], total: 0 }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      },
      };
    },
    {
      name: 'cart-storage',
    }
  )
);

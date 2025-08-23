import { create } from 'zustand';

// Cart store for managing cart state and UI
interface CartStore {
  isOpen: boolean;
  items: any[];
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  getItemCount: () => number;
  addItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  isOpen: false,
  items: [],
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  getItemCount: () => {
    const items = get().items;
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  },
  addItem: (item: any) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i => 
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (itemId: string) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
  clearCart: () => set({ items: [] }),
}));
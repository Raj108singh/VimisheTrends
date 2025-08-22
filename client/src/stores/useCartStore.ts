import { create } from 'zustand';

// Simple cart sidebar store for UI state
interface CartSidebarStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartSidebarStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
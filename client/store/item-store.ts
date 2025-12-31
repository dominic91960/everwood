import { create } from "zustand";
import { CartItem } from "@/lib/types";

type ItemStore = {
  item: CartItem;
  setItem: (item: CartItem) => void;
  updateQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  updateAttribute: (attributeId: string, variation: string) => void;
  clearItem: () => void;
};

export const useItemStore = create<ItemStore>((set) => ({
  item: {
    _id: "",
    title: "",
    productImage: "",
    price: 0,
    attributes: [],
    quantity: 0,
  },

  setItem: (item) => set({ item }),

  updateQuantity: (quantity) =>
    set((state) => ({
      item: { ...state.item, quantity },
    })),

  incrementQuantity: () =>
    set((state) => ({
      item: { ...state.item, quantity: state.item.quantity + 1 },
    })),

  decrementQuantity: () =>
    set((state) => ({
      item: {
        ...state.item,
        quantity: Math.max(0, state.item.quantity - 1),
      },
    })),

  updateAttribute: (attributeId, variation) =>
    set((state) => ({
      item: {
        ...state.item,
        attributes: state.item.attributes.map((attr) =>
          attr.attribute._id === attributeId
            ? { ...attr, selectedVariation: variation }
            : attr,
        ),
      },
    })),

  clearItem: () =>
    set({
      item: {
        _id: "",
        title: "",
        productImage: "",
        price: 0,
        attributes: [],
        quantity: 0,
      },
    }),
}));

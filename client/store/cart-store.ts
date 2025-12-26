import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem, CartItemAttribute } from "@/lib/types";

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, attributes: CartItemAttribute[]) => void;
  clearCart: () => void;
  updateQuantity: (
    id: string,
    attributes: CartItemAttribute[],
    quantity: number,
  ) => void;
  incrementQuantity: (id: string, attributes: CartItemAttribute[]) => void;
  decrementQuantity: (id: string, attributes: CartItemAttribute[]) => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i._id === item._id &&
              i.attributes.every(
                (attr, index) =>
                  attr.attribute._id === item.attributes[index].attribute._id &&
                  attr.selectedVariation ===
                    item.attributes[index].selectedVariation,
              ),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === item._id &&
                i.attributes.every(
                  (attr, index) =>
                    attr.attribute._id ===
                      item.attributes[index].attribute._id &&
                    attr.selectedVariation ===
                      item.attributes[index].selectedVariation,
                )
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id, attributes) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i._id === id &&
                i.attributes.every(
                  (attr, index) =>
                    attr.attribute._id === attributes[index].attribute._id &&
                    attr.selectedVariation ===
                      attributes[index].selectedVariation,
                )
              ),
          ),
        })),

      clearCart: () => set({ items: [] }),

      updateQuantity: (id, attributes, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id &&
            i.attributes.every(
              (attr, index) =>
                attr.attribute._id === attributes[index].attribute._id &&
                attr.selectedVariation === attributes[index].selectedVariation,
            )
              ? { ...i, quantity }
              : i,
          ),
        })),

      incrementQuantity: (id, attributes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id &&
            i.attributes.every(
              (attr, index) =>
                attr.attribute._id === attributes[index].attribute._id &&
                attr.selectedVariation === attributes[index].selectedVariation,
            )
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        })),

      decrementQuantity: (id, attributes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id &&
            i.attributes.every(
              (attr, index) =>
                attr.attribute._id === attributes[index].attribute._id &&
                attr.selectedVariation === attributes[index].selectedVariation,
            )
              ? { ...i, quantity: Math.max(1, i.quantity - 1) }
              : i,
          ),
        })),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

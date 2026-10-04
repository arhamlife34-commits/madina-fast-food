"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import type { Product } from "@/app/data/products";

type CartItem = Product & {
  quantity: number;
  selectedSize?: string;
  selectedAddon?: string;
  addonPrice?: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    product: Product & {
      selectedSize?: string;
      selectedAddon?: string;
      addonPrice?: number;
    }
  ) => void;

  removeFromCart: (
    id: number,
    selectedSize?: string,
    selectedAddon?: string
  ) => void;

  increaseQty: (
    id: number,
    selectedSize?: string,
    selectedAddon?: string
  ) => void;

  decreaseQty: (
    id: number,
    selectedSize?: string,
    selectedAddon?: string
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  /* ================================
     LOAD CART
  ================================= */

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      localStorage.removeItem("cart");
    }
  }, []);

  /* ================================
     SAVE CART
  ================================= */

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    /*
      Navbar / Quick Cart ko immediately
      update karne ke liye event.
    */

    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  /* ================================
     ADD TO CART
  ================================= */

  function addToCart(
    product: Product & {
      selectedSize?: string;
      selectedAddon?: string;
      addonPrice?: number;
    }
  ) {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedAddon === product.selectedAddon
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedAddon === product.selectedAddon
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  /* ================================
     REMOVE
  ================================= */

  function removeFromCart(
    id: number,
    selectedSize?: string,
    selectedAddon?: string
  ) {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedAddon === selectedAddon
          )
      )
    );
  }

  /* ================================
     INCREASE
  ================================= */

  function increaseQty(
    id: number,
    selectedSize?: string,
    selectedAddon?: string
  ) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.selectedSize === selectedSize &&
        item.selectedAddon === selectedAddon
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  /* ================================
     DECREASE
  ================================= */

  function decreaseQty(
    id: number,
    selectedSize?: string,
    selectedAddon?: string
  ) {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedAddon === selectedAddon
        ) {
          if (item.quantity === 1) {
            return [];
          }

          return [
            {
              ...item,
              quantity: item.quantity - 1,
            },
          ];
        }

        return [item];
      })
    );
  }

  /* ================================
     CLEAR CART
  ================================= */

  function clearCart() {
    setCart([]);

    localStorage.removeItem("cart");

    /*
      Force Navbar / Quick Cart update.
    */

    window.dispatchEvent(new Event("cartUpdated"));
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "CartContext must be used inside CartProvider"
    );
  }

  return context;
}
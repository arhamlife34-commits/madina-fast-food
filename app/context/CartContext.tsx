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
  addToCart: (product: Product & { selectedSize?: string }) => void;
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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);


useEffect(() => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}, [cart]);
  // Temporary Debug
  console.log("CART DATA:", cart);

  function addToCart(
  product: Product & { selectedSize?: string }
) {
    // Temporary Debug
    console.log("ADD CLICKED", product.name);

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

 function removeFromCart(
  id: number,
  selectedSize?: string,
  selectedAddon?: string
) {
  console.log(
  "REMOVE FUNCTION:",
  id,
  selectedSize
);
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
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
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
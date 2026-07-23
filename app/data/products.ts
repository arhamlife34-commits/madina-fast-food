export type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  regular_price?: number;
large_price?: number;
jumbo_price?: number;

small_price?: number;
medium_price?: number;

cheese_price?: number;
fries_price?: number;
  isDeal: boolean;
  selectedSize?: string; 
  selectedAddon?: string;
addonPrice?: number;
};
export const products: Product[] = [
  {
    id: 1,
    name: "Zinger Burger",
    category: "Burger",
    image: "/images/burger.jpg",
    description: "Crispy chicken fillet with lettuce & mayo",
    price: 450,
    isDeal: true,
  },
  {
    id: 2,
    name: "Zinger Tower",
    category: "Burger",
    image: "/images/burger.jpg",
    description: "Double zinger with hash brown & cheese",
    price: 520,
    isDeal: true,
  },
  {
    id: 3,
    name: "Double Patty Burger",
    category: "Burger",
    image: "/images/burger.jpg",
    description: "Double beef patty with cheese",
    price: 550,
    isDeal: false,
  },
  {
    id: 4,
    name: "Chicken Shawarma",
    category: "Shawarma",
    image: "/images/shawarma.jpg",
    description: "Fresh tortilla with grilled chicken",
    price: 320,
    isDeal: false,
  },
  {
    id: 5,
    name: "Special Pizza",
    category: "Pizza",
    image: "/images/pizza.jpg",
    description: "Loaded cheese pizza",
    price: 850,
    isDeal: true,
  },
  {
    id: 6,
    name: "French Fries",
    category: "Fries",
    image: "/images/fries.jpg",
    description: "Golden crispy fries",
    price: 200,
    isDeal: false,
  },
  {
    id: 7,
    name: "Loaded Fries",
    category: "Fries",
    image: "/images/fries.jpg",
    description: "Cheese loaded fries",
    price: 380,
    isDeal: false,
  },
  {
    id: 8,
    name: "Chicken Platter",
    category: "Platter",
    image: "/images/platter.jpg",
    description: "Chicken with fries & drink",
    price: 950,
    isDeal: false,
  },
];
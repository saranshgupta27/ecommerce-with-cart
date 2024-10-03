import { useEffect, useState } from "react";
import { CartItem } from "../types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await fetch("/api/cart");
    const data = await response.json();
    setCart(data);
  };

  const addToCart = async (productId: number) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await response.json();
    if (response.ok) {
      setCart(data.cart);
    }
  };

  const deleteItem = async (productId: number) => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (response.ok) {
      fetchCart(); // Refresh the cart after deletion
    }
  };

  const resetCart = () => {
    return setCart([]);
  };

  return { cart, addToCart, deleteItem, resetCart };
};

import React, { createContext, useState, useContext } from "react";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
  portal_id: string;
  latitude: string;
  longitude: string;
  is_payment?: boolean;
  is_virtual_event?: boolean;
}

interface TicketType {
  id: string;
  name: string;
  price: string;
  available: number;
  currency: { code: string };
  schedure: { id: string; date: string };
  image: string;
  is_personal: boolean;
  is_numbered: boolean;
}

interface CartItem {
  ticketId: string;
  quantity: number;
  name: string;
  price: string;
  currency: string;
  isNumbered: boolean;
  event: EventType;
  date: string;
  personalInfo?: { fullName: string; email: string };
  userId?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (ticketId: string) => void;
  clearCart: () => void;
  increaseQuantity: (ticketId: string) => void;
  decreaseQuantity: (ticketId: string) => void;
  totalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) => i.ticketId === item.ticketId && i.date === item.date
      );
      if (existingItem) {
        // If the same ticket type AND date exists, increment quantity
        return prevCart.map((i) =>
          i.ticketId === item.ticketId && i.date === item.date
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      // Otherwise, add as a new item
      return [...prevCart, item];
    });
  };

  const removeFromCart = (ticketId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.ticketId !== ticketId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseQuantity = (ticketId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.ticketId === ticketId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (ticketId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.ticketId === ticketId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price || "0");
      return total + item.quantity * (isNaN(price) ? 0 : price);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;

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

interface NumberedTicket {
  id: string;
  prefix: string;
  number: number;
  status: number;
}

interface CartItem {
  ticketId: string;
  quantity: number;
  name: string;
  price: string;
  currency: string;
  isNumbered: boolean;
  numberedTickets?: NumberedTicket[];
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
  getCartError: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartError, setCartError] = useState<string | null>(null); // New: Error state

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) => i.ticketId === item.ticketId && i.date === item.date
      );
      if (existingItem) {
        // if (existingItem.personalInfo || existingItem.isNumbered) {
        //   return prevCart.map((i) =>
        //     i.ticketId === item.ticketId && i.date === item.date ? item : i
        //   );
        // }
        if (existingItem.isNumbered || existingItem.personalInfo) {
          setCartError(
            "No es posible agregar más tickets de este tipo al carrito."
          );
          return prevCart; // No change, error set
        }
        return prevCart.map((i) =>
          i.ticketId === item.ticketId && i.date === item.date
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      setCartError(null); // Clear error if successful
      return [...prevCart, item];
    });
  };

  const removeFromCart = (ticketId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.ticketId !== ticketId)
    );
    setCartError(null);
  };

  const clearCart = () => {
    setCart([]);
    setCartError(null);
  };

  // const increaseQuantity = (ticketId: string) => {
  //   setCart((prevCart) =>
  //     prevCart.map((item) => {
  //       if (item.ticketId === ticketId) {
  //         if (item.personalInfo || item.isNumbered) {
  //           return item; // No change
  //         }
  //         return { ...item, quantity: item.quantity + 1 };
  //       }
  //       return item;
  //     })
  //   );
  // };

  // const decreaseQuantity = (ticketId: string) => {
  //   setCart((prevCart) =>
  //     prevCart
  //       .map((item) => {
  //         if (item.ticketId === ticketId) {
  //           // Prevent decrease if personal or numbered
  //           if (item.personalInfo || item.isNumbered) {
  //             return item; // No change
  //           }
  //           return { ...item, quantity: item.quantity - 1 };
  //         }
  //         return item;
  //       })
  //       .filter((item) => item.quantity > 0)
  //   );
  // };
  const increaseQuantity = (ticketId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.ticketId === ticketId &&
          !item.isNumbered &&
          !item.personalInfo
        ) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
    setCartError(null);
  };

  const decreaseQuantity = (ticketId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (
            item.ticketId === ticketId &&
            !item.isNumbered &&
            !item.personalInfo
          ) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
    setCartError(null);
  };

  const totalAmount = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price || "0");
      return total + item.quantity * (isNaN(price) ? 0 : price);
    }, 0);
  };

  const getCartError = () => cartError;

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
        getCartError,
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

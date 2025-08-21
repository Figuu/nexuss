import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

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
  addedAt?: number; // Timestamp for sorting
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
  // New features
  cartItemCount: () => number;
  isCartEmpty: () => boolean;
  getCartByEvent: (eventId: string) => CartItem[];
  validateCart: () => { isValid: boolean; errors: string[] };
  saveCartToStorage: () => Promise<void>;
  loadCartFromStorage: () => Promise<void>;
  updateCartItem: (ticketId: string, updates: Partial<CartItem>) => void;
  moveToWishlist: (ticketId: string) => void;
  getCartSummary: () => {
    totalItems: number;
    totalAmount: number;
    currency: string;
    eventsCount: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage();
    }
  }, [cart, isLoading]);

  const saveCartToStorage = async () => {
    try {
      await SecureStore.setItemAsync('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await SecureStore.getItemAsync('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) => i.ticketId === item.ticketId && i.date === item.date
      );
      
      if (existingItem) {
        if (existingItem.isNumbered || existingItem.personalInfo) {
          setCartError(
            "No es posible agregar más tickets de este tipo al carrito."
          );
          return prevCart;
        }
        return prevCart.map((i) =>
          i.ticketId === item.ticketId && i.date === item.date
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      
      setCartError(null);
      return [...prevCart, { ...item, addedAt: Date.now() }];
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

  // New utility functions
  const cartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isCartEmpty = () => {
    return cart.length === 0;
  };

  const getCartByEvent = (eventId: string) => {
    return cart.filter(item => item.event.id === eventId);
  };

  const validateCart = () => {
    const errors: string[] = [];
    
    if (cart.length === 0) {
      errors.push("El carrito está vacío");
    }

    // Check for expired events (example validation)
    const now = new Date();
    cart.forEach(item => {
      const eventDate = new Date(item.date);
      if (eventDate < now) {
        errors.push(`El evento "${item.event.name}" ya ha pasado`);
      }
    });

    // Check for personal info requirements
    cart.forEach(item => {
      if (item.personalInfo && (!item.personalInfo.fullName || !item.personalInfo.email)) {
        errors.push(`Información personal incompleta para "${item.name}"`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const updateCartItem = (ticketId: string, updates: Partial<CartItem>) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.ticketId === ticketId ? { ...item, ...updates } : item
      )
    );
  };

  const moveToWishlist = (ticketId: string) => {
    // This could be implemented with a separate wishlist context
    // For now, we'll just remove from cart
    removeFromCart(ticketId);
  };

  const getCartSummary = () => {
    const totalItems = cartItemCount();
    const totalAmountValue = totalAmount();
    const currency = cart[0]?.currency || "BOB";
    const eventsCount = new Set(cart.map(item => item.event.id)).size;

    return {
      totalItems,
      totalAmount: totalAmountValue,
      currency,
      eventsCount
    };
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
        getCartError,
        cartItemCount,
        isCartEmpty,
        getCartByEvent,
        validateCart,
        saveCartToStorage,
        loadCartFromStorage,
        updateCartItem,
        moveToWishlist,
        getCartSummary,
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

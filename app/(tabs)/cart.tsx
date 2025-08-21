import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PaymentOptionsModal from "../../components/payment/paymentOptions";
import CartItem from "../../components/CartItem";
import { FontAwesome6 } from "@expo/vector-icons";

const CartScreen = () => {
  const { authState } = useAuth();
  const {
    cart,
    clearCart,
    removeFromCart,
    totalAmount,
    cartItemCount,
    isCartEmpty,
    validateCart,
    getCartSummary,
    moveToWishlist,
  } = useCart();

  const [modalVisible, setModalVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');

  useFocusEffect(
    useCallback(() => {
      setRefreshing(false);
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBuy = () => {
    const validation = validateCart();
    if (!validation.isValid) {
      Alert.alert("Error en el carrito", validation.errors.join('\n'));
      return;
    }
    setModalVisible(true);
  };

  const handleClearCart = () => {
    Alert.alert(
      "Limpiar carrito",
      "¿Estás seguro de que quieres limpiar todo el carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpiar", style: "destructive", onPress: clearCart },
      ]
    );
  };

  const handleRemoveItem = (ticketId: string) => {
    const item = cart.find(item => item.ticketId === ticketId);
    Alert.alert(
      "Eliminar item",
      `¿Estás seguro de que quieres eliminar "${item?.name}" del carrito?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => removeFromCart(ticketId) },
      ]
    );
  };

  const handleClose = () => {
    if (cardVisible || qrVisible) {
      closePayment();
    }
    setTimeout(() => setModalVisible(false), 100);
  };

  const closePayment = () => {
    setCardVisible(false);
    setQrVisible(false);
    setTimeout(() => setModalVisible(false), 100);
  };

  const getSortedCart = () => {
    const sortedCart = [...cart];
    switch (sortBy) {
      case 'date':
        return sortedCart.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'name':
        return sortedCart.sort((a, b) => a.event.name.localeCompare(b.event.name));
      case 'price':
        return sortedCart.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      default:
        return sortedCart;
    }
  };

  // Create payment data for the first item (for now, we'll handle one item at a time)
  // In a more complex implementation, you might want to process multiple items
  const getPaymentData = () => {
    if (cart.length === 0) return null;
    
    const firstItem = cart[0];
    return {
      event: firstItem.event,
      ticketTypeId: firstItem.ticketId,
      quantity: firstItem.quantity,
      totalAmount: totalAmount(),
      currency: firstItem.currency,
      fullName: firstItem.personalInfo?.fullName || authState.user?.name,
      email: firstItem.personalInfo?.email || authState.user?.username,
      numberedTicketId: firstItem.numberedTickets?.[0]?.id || null,
    };
  };

  const cartSummary = getCartSummary();
  const paymentData = getPaymentData();

  if (isCartEmpty()) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-background-card p-8 rounded-2xl items-center">
            <FontAwesome6 name="shopping-cart" size={64} color="#6b7280" />
            <Text className="text-white text-xl font-bold mt-4 text-center">
              Tu carrito está vacío
            </Text>
            <Text className="text-white-100 text-center mt-2">
              Agrega algunos tickets para comenzar
            </Text>
            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-full mt-6"
              onPress={() => {/* Navigate to explore */}}
            >
              <Text className="text-white font-semibold">Explorar eventos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-background-card px-4 py-3 flex-row justify-between items-center">
        <Text className="text-white text-xl font-bold">Carrito</Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-white-100">{cartItemCount()} items</Text>
          <TouchableOpacity onPress={handleClearCart}>
            <FontAwesome6 name="trash" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Options */}
      <View className="bg-background-card mx-4 mt-2 rounded-lg p-3">
        <Text className="text-white-100 text-sm mb-2">Ordenar por:</Text>
        <View className="flex-row space-x-2">
          {[
            { key: 'date', label: 'Fecha', icon: 'calendar' },
            { key: 'name', label: 'Nombre', icon: 'font' },
            { key: 'price', label: 'Precio', icon: 'money-bill' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSortBy(option.key as any)}
              className={`px-3 py-2 rounded-full flex-row items-center space-x-1 ${
                sortBy === option.key ? 'bg-primary' : 'bg-background'
              }`}
            >
              <FontAwesome6 
                name={option.icon as any} 
                size={12} 
                color={sortBy === option.key ? 'white' : '#6b7280'} 
              />
              <Text className={`text-xs ${
                sortBy === option.key ? 'text-white' : 'text-white-100'
              }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {getSortedCart().map((item) => (
          <CartItem
            key={`${item.ticketId}-${item.date}`}
            item={item}
            onRemove={handleRemoveItem}
            onMoveToWishlist={moveToWishlist}
            showActions={true}
          />
        ))}
      </ScrollView>

      {/* Cart Summary & Actions */}
      {cart.length > 0 && (
        <View className="bg-background-card mx-4 mb-4 rounded-lg p-4">
          <Text className="text-white text-lg font-bold mb-3">Resumen</Text>
          <View className="space-y-2 mb-4">
            <View className="flex-row justify-between">
              <Text className="text-white-100">Total de ítems:</Text>
              <Text className="text-white">{cartSummary.totalItems}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-white-100">Eventos:</Text>
              <Text className="text-white">{cartSummary.eventsCount}</Text>
            </View>
            <View className="flex-row justify-between border-t border-white-200 pt-2">
              <Text className="text-white font-bold text-lg">Total:</Text>
              <Text className="text-white font-bold text-lg">
                {cartSummary.totalAmount.toFixed(2)} {cartSummary.currency}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleBuy}
            disabled={!paymentData}
            className={`p-4 rounded-lg ${
              paymentData ? 'bg-primary' : 'bg-gray-500'
            }`}
          >
            <Text className="text-white font-bold text-center text-lg">
              Proceder al pago
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {paymentData && (
        <PaymentOptionsModal
          visible={modalVisible}
          onClose={handleClose}
          qrVisible={qrVisible}
          setQrVisible={setQrVisible}
          paymentData={paymentData}
          closePayment={closePayment}
        />
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

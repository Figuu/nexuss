import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useCallback, useState } from "react";
import useAuthGuard from "../../hooks/useAuthGuard";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { images } from "../../constants";
import PaymentOptionsModal from "../../components/payment/paymentOptions";

interface NumberedTicket {
  id: string;
  prefix: string;
  number: number;
  status: number;
}

const Profile = () => {
  const { onLogout } = useAuth();
  const checkAuth = useAuthGuard();
  const { authState } = useAuth();

  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalAmount,
  } = useCart();
  const [openCart, setOpenCart] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated) {
        return;
      }
    }, [checkAuth])
  );

  const logout = async () => {
    await onLogout();
    router.push("Login");
  };

  const handleBuy = () => {
    setModalVisible(true);
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

  const paymentData = {
    amount: totalAmount(),
    currency: cart[0]?.currency || "BOB",
    description: `Compra de ${cart.length} tickets`,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-2">
        <View className="py-6 items-center">
          <View className="h-24 w-24 rounded-full bg-background-card flex items-center justify-center">
            <Text className="text-3xl font-bold text-white">U</Text>
          </View>
          <Text className="mt-4 text-xl font-sbold text-white">
            {authState.user?.name}
          </Text>
          <Text className="text-sm text-white">{authState.user?.username}</Text>
        </View>

        <View className="mt-2 bg-background-card rounded-lg">
          <TouchableOpacity className="flex-row justify-between items-center px-4 py-4 border-b border-white-200">
            <Text className="text-base text-white-100">Celular</Text>
            <Text className="text-sm text-white">{authState.user?.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row justify-between items-center px-4 py-4 border-b border-white-200">
            <Text className="text-base text-white-100">Soporte</Text>
            <Text className="text-sm text-white">Discord</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row justify-between items-center px-4 py-4 border-b border-white-200">
            <Text className="text-base text-white-100">Acerca de</Text>
            <Text className="text-sm text-white">MiTix</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpenCart(true)}
            className="flex-row justify-between items-center px-4 py-4"
          >
            <Text className="text-base text-white-100">Carrito</Text>
            <Text className="text-lg text-white rounded-full bg-primary px-2 text-center">
              {cart.length}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 items-center">
          <TouchableOpacity
            onPress={logout}
            className="px-6 py-3 bg-primary rounded-full"
          >
            <Text className="text-white font-semibold">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={openCart}
          transparent={false}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setOpenCart(false)}
        >
          <SafeAreaView className="flex-1 bg-background items-center">
            <View className="bg-background-card w-full h-12 items-center justify-center">
              <Text className="text-white text-xl font-bold">Carrito</Text>
            </View>
            <ScrollView className="h-full w-full p-2">
              {cart.length === 0 ? (
                <Text className="text-white text-center mt-4">
                  El carrito está vacío
                </Text>
              ) : (
                cart.map((item) => {
                  const isRestricted = item.personalInfo || item.isNumbered;
                  return (
                    <View
                      key={`${item.ticketId}-${item.date}`}
                      className="flex-row w-full bg-background-card rounded-xl mb-2 relative"
                    >
                      <View className="w-full h-full bg-white rounded-xl absolute overflow-hidden">
                        <Image
                          source={{ uri: item.event?.front_page_image }}
                          resizeMode="cover"
                          className="w-full h-full rounded-xl"
                        />
                        <View className="w-full h-full absolute bg-black opacity-75" />
                      </View>

                      <View className="flex-row flex-1 p-2">
                        <View className="flex-1">
                          <Text
                            className="text-white font-sbold text-base"
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {item.event.name}
                          </Text>
                          <Text className="text-white-100">
                            Ticket: {item.name}
                          </Text>
                          <Text className="text-white-100">
                            Fecha: {formatDate(item.date)}
                          </Text>
                          <Text className="text-white-100">
                            Cantidad: {item.quantity}
                          </Text>
                          {item.isNumbered && item.numberedTickets && (
                            <Text className="text-white-100">
                              Asientos:{" "}
                              {item.numberedTickets
                                .map((nt) => `${nt.prefix}-${nt.number}`)
                                .join(", ")}
                            </Text>
                          )}
                          <Text className="text-white-100">
                            Precio: {item.price} {item.currency}
                          </Text>
                          {item.personalInfo && (
                            <Text className="text-white-100">
                              Nombre: {item.personalInfo.fullName}
                            </Text>
                          )}
                        </View>
                        <View className="flex-row items-center mr-2">
                          <View className="flex-row justify-between items-center space-x-2">
                            {isRestricted ? null : (
                              <>
                                <TouchableOpacity
                                  onPress={() =>
                                    decreaseQuantity(item.ticketId)
                                  }
                                  className="bg-background w-8 h-8 items-center justify-center rounded-md"
                                  disabled={item.quantity <= 1}
                                >
                                  <Text className="text-white text-lg">-</Text>
                                </TouchableOpacity>
                                <Text className="text-white text-lg">
                                  {item.quantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    increaseQuantity(item.ticketId)
                                  }
                                  className="bg-background w-8 h-8 items-center justify-center rounded-md"
                                >
                                  <Text className="text-white text-lg">+</Text>
                                </TouchableOpacity>
                              </>
                            )}
                            <TouchableOpacity
                              onPress={() => removeFromCart(item.ticketId)}
                              className="bg-red-500 w-8 h-8 items-center justify-center rounded-md"
                            >
                              <Text className="text-white text-lg">×</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
            {cart.length > 0 && (
              <View className="w-full p-2">
                <View className="bg-background-card p-4 rounded-lg mb-2">
                  <Text className="text-white text-lg font-bold">Resumen</Text>
                  <Text className="text-white-100">
                    Total de ítems:{" "}
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Text>
                  <Text className="text-white-100">
                    Total: {totalAmount().toFixed(2)}{" "}
                    {cart[0]?.currency || "BOB"}
                  </Text>
                </View>
                <View className="w-full flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => setOpenCart(false)}
                    className="bg-background-card p-4 rounded-lg flex-1"
                  >
                    <Text className="text-white font-semibold text-center">
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={clearCart}
                    className="bg-primary p-4 rounded-lg flex-1"
                  >
                    <Text className="text-white font-semibold text-center">
                      Limpiar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleBuy}
                    className="bg-primary p-4 rounded-lg flex-grow"
                  >
                    <Text className="text-white font-semibold text-center">
                      Comprar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </SafeAreaView>

          <PaymentOptionsModal
            visible={modalVisible}
            onClose={closePayment}
            qrVisible={qrVisible}
            setQrVisible={setQrVisible}
            paymentData={paymentData}
            closePayment={closePayment}
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

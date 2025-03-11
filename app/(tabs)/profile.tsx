import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuthGuard from "../../hooks/useAuthGuard";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { images } from "../../constants";

const Profile = () => {
  const { onLogout } = useAuth();
  const checkAuth = useAuthGuard();
  const { authState } = useAuth();

  const { cart, clearCart, increaseQuantity, decreaseQuantity, totalAmount } =
    useCart();
  const [openCart, setOpenCart] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  useFocusEffect(() => {
    const isAuthenticated = checkAuth();
    // console.log(authState.user);
    if (!isAuthenticated) {
      return;
    }
  });

  const logout = async () => {
    await onLogout();
    // router.push("Login");
  };

  const closePayment = () => {
    setCardVisible(false);
    setQrVisible(false);
  };

  const handleBuy = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-2">
        {/* Profile Info */}
        <View className="py-6 items-center">
          <View className="h-24 w-24 rounded-full bg-background-card flex items-center justify-center">
            <Text className="text-3xl font-bold text-white">U</Text>
          </View>
          <Text className="mt-4 text-xl font-sbold text-white">
            {authState.user?.name}
          </Text>
          <Text className="text-sm text-white">{authState.user?.username}</Text>
        </View>

        {/* Options */}
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
            <Text className="text-sm text-white ">MiTix</Text>
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

        {/* Logout */}
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
          className="m-0 justify-end"
          onRequestClose={() => {
            setOpenCart(false);
          }}
        >
          <SafeAreaView className="flex-1 bg-background items-center">
            <View className="bg-background-card w-full h-12 items-center justify-center">
              <Text className="text-white text-xl font-bold">Carrito</Text>
            </View>
            <ScrollView className="h-full w-full p-2">
              {cart.map((item) => (
                <TouchableOpacity
                  key={item.ticketId}
                  className="flex-row w-full bg-background-card rounded-xl mb-2"
                >
                  <View className="h-[100px] aspect-square bg-white rounded-xl mr-4">
                    <Image
                      src={item.event?.front_page_image}
                      resizeMode="cover"
                      className="w-full h-full rounded-xl"
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-white font-sbold text-base"
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {item.event.name}
                    </Text>
                    <Text className="text-white-100">Ticket: {item.name}</Text>
                    <Text className="text-white-100">
                      Cantidad: {item.quantity}
                    </Text>
                    <Text className="text-white-100">
                      Precio: {item.price} {item.currency}
                    </Text>
                  </View>
                  <View className="flex-row items-center mr-2">
                    <View className="flex-row justify-between items-center space-x-2">
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.ticketId)}
                        className="bg-background w-8 h-8 items-center justify-center rounded-md"
                      >
                        <Text className="text-white text-lg">-</Text>
                      </TouchableOpacity>
                      <Text className="text-white text-lg">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.ticketId)}
                        className="bg-background w-8 h-8 items-center justify-center rounded-md"
                      >
                        <Text className="text-white text-lg">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className="absolute bottom-2 w-full">
              <View className="px-2 w-full">
                <Text className="text-white text-xl font-bold">
                  Total: {totalAmount().toFixed(2)} {cart[0]?.currency}
                </Text>
              </View>
              <View className="w-full p-2 flex-row space-x-2">
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
                  className="bg-primary p-4 rounded-lg flex-1 "
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
          </SafeAreaView>
          <Modal
            visible={modalVisible}
            transparent={false}
            animationType="slide"
            presentationStyle="pageSheet"
            className="m-0 justify-end"
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <SafeAreaView className="bg-background rounded-t-3xl items-center h-[30vh]">
              <View className="bg-white my-2 h-1 w-[40vw] rounded-full self-center" />
              <Text className="text-white">Pagar con</Text>
              <View className="flex-row mt-4">
                <TouchableOpacity
                  onPress={() => {
                    setCardVisible(true);
                  }}
                  className="bg-background-card p-4 mr-2 rounded-lg"
                >
                  <Image
                    source={images.card}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setQrVisible(true);
                  }}
                  className="bg-background-card p-4 ml-2 rounded-lg"
                >
                  <Image
                    source={images.qr}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            {/* <CardPaymentView visible={cardVisible} onClose={closePayment} /> */}
            {/* <QrPaymentView visible={qrVisible} onClose={closePayment} /> */}
          </Modal>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

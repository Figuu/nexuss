import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuthGuard from "../../hooks/useAuthGuard";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Modal from "react-native-modal";

const Profile = () => {
  const { onLogout } = useAuth();
  const checkAuth = useAuthGuard();
  const { authState } = useAuth();

  const [openCart, setOpenCart] = useState(false);

  const { cart, clearCart } = useCart();

  useFocusEffect(() => {
    const isAuthenticated = checkAuth();
    console.log(authState.user);
    if (!isAuthenticated) {
      return;
    }
  });

  const logout = async () => {
    await onLogout();
    // router.push("Login");
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
          animationIn="slideInUp"
          animationOut="slideOutDown"
          swipeDirection={"down"}
          isVisible={openCart}
          onSwipeComplete={() => setOpenCart(false)}
          onBackdropPress={() => setOpenCart(false)}
          presentationStyle="overFullScreen"
          backdropOpacity={0.5}
          className="m-0 justify-end"
        >
          <SafeAreaView className="bg-background rounded-t-3xl items-center mt-10 px-4 overflow-hidden">
            <ScrollView className="h-full w-max mx-4 bg-primary">
              {cart.map((item) => (
                <TouchableOpacity
                  key={item.ticketId}
                  className="flex-row justify-between items-center p-4 w-full h-max rounded-xl bg-background-card my-2"
                >
                  <Text className="text-base text-white-100">{item.event} </Text>
                  <Text className="text-base text-white-100">{item.name} </Text>
                  <Text className="text-sm text-white">{item.quantity}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

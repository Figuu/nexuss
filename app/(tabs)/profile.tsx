import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import useAuthGuard from "../../hooks/useAuthGuard";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { onLogout } = useAuth();
  const checkAuth = useAuthGuard();
  const { authState } = useAuth();

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
          <TouchableOpacity className="flex-row justify-between items-center px-4 py-4">
            <Text className="text-base text-white-100">Acerca de</Text>
            <Text className="text-sm text-white">MiTix</Text>
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
      </View>
    </SafeAreaView>
  );
};

export default Profile;

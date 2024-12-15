import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuthGuard from "../../hooks/useAuthGuard";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { onLogout } = useAuth();
  const checkAuth = useAuthGuard();

  useFocusEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      return;
    }
  });

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity className="bg-red h-12 items-center justify-center" onPress={onLogout}>
          <Text>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

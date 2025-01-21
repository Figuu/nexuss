import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import { images } from "../../constants";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import { FontAwesome6 } from "@expo/vector-icons";

interface PortalType {
  cover_image: string;
  profile_image: string;
  title: string;
  description: string;
}

const Portal = () => {
  const { id } = useGlobalSearchParams();
  const [portal, setPortal] = useState<PortalType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPortalData = async () => {
      try {
        const result = await axios.get(`${API_URL}/portal`, {
          params: {
            id: id,
          },
        });

        if (isMounted) {
          setPortal(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching portal data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortalData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    // Mostrar pantalla de carga cuando loading sea true
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size={"large"} color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="w-[100vw] -mx-4 -mt-16">
        <Image
          src={portal?.cover_image}
          resizeMode="cover"
          className="w-full h-[35vh]"
        />
        <Image
          source={images.gradient}
          resizeMode="cover"
          className="w-full h-[35vh] absolute top-0"
        />
        <Image
          src={portal?.profile_image}
          className="rounded-full w-[40vw] h-[40vw] absolute bottom-[-2vh] left-[30vw] border-white border-2"
        />
      </View>
      <View className="mt-7 items-center">
        <Text className="text-white text-4xl font-sblack">{portal?.title}</Text>
        <View className="mt-2">
          <Text className="text-gray-light">{portal?.description}</Text>
          <View className="flex-row mt-6 justify-evenly space-x-0 mx-4">
            <FontAwesome6 name="instagram" size={24} color="white" />
            <FontAwesome6 name="facebook" size={24} color="white" />
            <FontAwesome6 name="youtube" size={24} color="white" />
            <FontAwesome6 name="tiktok" size={24} color="white" />
            <FontAwesome6 name="spotify" size={24} color="white" />
          </View>
          <TouchableOpacity
            onPress={() => router.push("portal/1/events")}
            className="mt-8 rounded-2xl bg-white p-2 h-12 items-center justify-center"
          >
            <Text className="text-center font-sbold text-lg">Comprar entradas</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-4 rounded-2xl bg-white p-2 h-12 items-center justify-center">
            <Text className="text-center font-sbold text-lg">Nuestra Historia</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Portal;

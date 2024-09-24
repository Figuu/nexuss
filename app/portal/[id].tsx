import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
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
  const [portal, setPortal] = useState<PortalType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const testCall = async () => {
      try {
        const result = await axios.get(`${API_URL}/portal`, {
          params: {
            id: "547e39de-6fee-49b0-9f45-07712314b5bd",
          },
        });

        if (isMounted) {
          setPortal(result.data[0]);
          setLoading(false);  // Set loading to false when data is loaded
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // In case of error, hide the loader
      }
    };

    testCall();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray p-4">
      <View className="w-[100vw] -mx-4 -mt-16">
        {loading ? (
          // Skeleton for cover_image with pulse animation
          <View className="w-full h-[35vh] bg-gray-200 animate-pulse rounded-lg" />
        ) : (
          <>
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
          </>
        )}
        {loading ? (
          <View className="rounded-full w-[40vw] h-[40vw] absolute bottom-[-2vh] left-[30vw] bg-gray-200 border-white border-2 animate-pulse" />
        ) : (
          <Image
            src={portal?.profile_image}
            className="rounded-full w-[40vw] h-[40vw] absolute bottom-[-2vh] left-[30vw] border-white border-2"
          />
        )}
      </View>
      <View className="mt-7 items-center">
        {loading ? (
          <View className="w-[60vw] h-8 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <Text className="text-white text-4xl font-sblack">
            {portal?.title}
          </Text>
        )}
        <View className="mt-2">
          {loading ? (
            <View className="w-[80vw] h-6 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <Text className="text-gray-400">{portal?.description}</Text>
          )}
          <View className="flex-row mt-6 justify-evenly space-x-0 mx-4">
            <FontAwesome6 name="instagram" size={24} color="white" />
            <FontAwesome6 name="facebook" size={24} color="white" />
            <FontAwesome6 name="youtube" size={24} color="white" />
            <FontAwesome6 name="tiktok" size={24} color="white" />
            <FontAwesome6 name="spotify" size={24} color="white" />
          </View>
          <TouchableOpacity className="mt-8 rounded-2xl bg-white p-2 h-12 items-center justify-center">
            <Text className="text-center font-sbold text-lg">
              Comprar entradas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-4 rounded-2xl bg-white p-2 h-12 items-center justify-center">
            <Text className="text-center font-sbold text-lg">
              Nuestra Historia
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Portal;

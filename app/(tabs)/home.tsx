import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { router } from "expo-router";

const Home = () => {
  useEffect(() => {
    let isMounted = true;

    const testCall = async () => {
      try {
        const result = await axios.get(`${API_URL}/user`);
        if (isMounted) {
          // console.log("Home data:", result.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    testCall();

    return () => {
      isMounted = false;
    };
  }, []);

  const toEvent = () => {
    router.push("event/1")
  }

  return (
    <SafeAreaView className="bg-gray h-full px-4">
      <ScrollView>
        <View className="w-full flex justify-start mb-3">
          <Text className="text-4xl text-start text-white font-sbold">
            KayTik
          </Text>
        </View>
        <View className="mb-4">
          <Text className="text-white font-ssemibold text-xl">DESTACADOS</Text>
          <TouchableOpacity className="w-full h-[200px]" onPress={toEvent}>
            <Image
              source={images.dummy2}
              resizeMode="cover"
              className="w-full h-full rounded-xl"
            />
          </TouchableOpacity>
        </View>
        <View className="mb-4">
          <Text className="text-white font-ssemibold text-xl">
            PROXIMOS EVENTOS
          </Text>
          <ScrollView horizontal={true} className="">
            <View className="h-[200px] aspect-square bg-white rounded-xl mr-4">
              <Image
                source={images.dummy1}
                resizeMode="cover"
                className="w-full h-full rounded-xl"
              />
            </View>
            <View className="h-[200px] aspect-square bg-white rounded-xl mr-4">
              <Image
                source={images.dummy3}
                resizeMode="cover"
                className="w-full h-full rounded-xl"
              />
            </View>
            <View className="h-[200px] aspect-square bg-white rounded-xl mr-4">
              <Image
                source={images.dummy2}
                resizeMode="cover"
                className="w-full h-full rounded-xl"
              />
            </View>
            <View className="h-[200px] aspect-square bg-white rounded-xl mr-4">
              <Image
                source={images.dummy2}
                resizeMode="cover"
                className="w-full h-full rounded-xl"
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

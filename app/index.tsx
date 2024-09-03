import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";


export default function App() {
  return (
    <SafeAreaView className="bg-gray h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Text className="font-sblack text-6xl text-white">KayTix</Text>
          <Image
            source={images.example}
            resizeMode="contain"
            className="max-w-[380px] w-full h-[270px]"
          />
          <View className="flex-row relative mt-5">
            <Text className="text-3xl text-[#FE4949] font-bold text-center">
              Descubre
            </Text>
            <Text className="text-3xl text-white font-bold text-center mr-2">
              ,
            </Text>
            <Text className="text-3xl text-[#06FFC3] font-bold text-center mr-2">
              compra
            </Text>
          </View>
          <View className="flex-row relative">
            <Text className="text-3xl text-white font-bold text-center mr-2">
              y
            </Text>
            <Text className="text-3xl text-[#C567FF] font-bold text-center">
              comparte
            </Text>
          </View>
          <Text className="text-3xl text-white font-bold text-center">
            experiencias únicas
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

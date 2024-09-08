import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "../../constants"; // Asegúrate de que la imagen del evento esté disponible aquí.

const Event = () => {
  const router = useRouter();

  const handleBuyTickets = () => {
    // Lógica para comprar tickets, redirigir o abrir una web.
  };

  return (
    <SafeAreaView className="flex-1 bg-gray p-4">
      <View className="w-[100vw] -mx-4 -mt-16">
        <Image
          source={images.dummy2} // Reemplaza dummyEvent con la imagen correcta del evento
          resizeMode="cover"
          className="w-full h-[45vh]"
        />
        <Image
          source={images.gradient}
          resizeMode="cover"
          className="w-full h-[45vh] absolute top-0"
        />
      </View>
      <View className="mt-2">
        <Text className="text-white text-3xl font-sbold">
          Brightlight Music Festival
        </Text>
        <View className="mt-2">
          <Text className="text-gray-400">Friday, 24 Aug 2019</Text>
          <Text className="text-gray-400">6:30PM - 9:30PM</Text>
          <Text className="text-gray-400 mt-2">Daboi Concert Hall</Text>
          <Text className="text-gray-400">5/7 Kolejowa, 01-217 Warsaw</Text>
          <Text className="text-gray-400 mt-2">Indie Rock</Text>
          <Text className="text-gray-400 mt-2">€40 - 90</Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-red-500 mx-4 mt-8 p-4 absolute w-full rounded-xl bottom-8"
        onPress={handleBuyTickets}
      >
        <Text className="text-white text-center text-lg">Buy tickets</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Event;

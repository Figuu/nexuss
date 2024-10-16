import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { images } from "../../constants"; // Asegúrate de que la imagen del evento esté disponible aquí.
import axios from "axios";
import { API_URL } from "../context/AuthContext";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
  portal_id: string;
}

const Event = () => {
  const { id } = useGlobalSearchParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("id", id);

  useEffect(() => {
    // Función para obtener los detalles del evento desde la API
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(API_URL + "/event", {
          params: {
            id: id,
            status_id: 1,
          },
        });
        console.log("response", response.data);
        setEvent(response.data[0]);
      } catch (err) {
        setError("Error al cargar los detalles del evento");
      } finally {
        setLoading(false);
      }
    };

    if (id && event === null) {
      fetchEventDetails(); // Llama a la API si el id está disponible
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray">
        <Text className="text-white">{error}</Text>
      </SafeAreaView>
    );
  }

  const handleBuyTickets = () => {
    // Lógica para comprar tickets, redirigir o abrir una web.
  };

  return (
    <SafeAreaView className="flex-1 bg-gray p-4">
      {event && (
        <>
          <View className="w-[100vw] -mx-4 -mt-16">
            <Image
              src={event.front_page_image} // Muestra la imagen del evento o una por defecto
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
            <Text className="text-white text-3xl font-sbold">{event.name}</Text>
            <View className="mt-2">
              <Text className="text-gray-400">📍{event.address}</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-red-500 mx-4 mt-8 p-4 absolute w-full rounded-xl bottom-8"
            onPress={handleBuyTickets}
          >
            <Text className="text-white text-center text-lg">Buy tickets</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default Event;

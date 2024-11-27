import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { router } from "expo-router";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
  portal_id: string;
  latitude: string;
  longitude: string;
}

const Home = () => {
  const [nextEvents, setNexEvents] = useState<EventType[]>([]);
  const [sportsEvents, setSportsEvents] = useState<EventType[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<EventType[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchNext = async () => {
      try {
        const result = await axios.get(`${API_URL}/event`, {
          params: {
            status_id: 1,
          },
        });
        if (isMounted) {
          setNexEvents(result.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchNext();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSports = async () => {
      try {
        const result = await axios.get(`${API_URL}/event`, {
          params: {
            status_id: 1,
            portal_type: "1c5c51d1-a72b-4561-bcb2-5f38117304a6",
          },
        });
        if (isMounted) {
          setSportsEvents(result.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchSports();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCultural = async () => {
      try {
        const result = await axios.get(`${API_URL}/event`, {
          params: {
            status_id: 1,
            portal_type: "bdd23728-2238-4e2f-9058-5e0f15f08f90",
          },
        });
        if (isMounted) {
          setCulturalEvents(result.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchCultural();

    return () => {
      isMounted = false;
    };
  }, []);

  const toEvent = (eventId: any) => {
    router.push(`event/${eventId}`);
  };

  const toCategory = (categoryId: any) => {
    router.push(`event/categories/${categoryId}`);
  };

  return (
    <SafeAreaView className="bg-gray h-max px-4">
      <View className="w-full flex justify-start">
        <Text className="text-4xl text-start text-white font-sblack">
          MiTix
        </Text>
      </View>
      <ScrollView className="h-full">
        {/* UPCOMING SECTION */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-ssemibold text-xl">
              PRÓXIMOS EVENTOS
            </Text>
            <TouchableOpacity>
              <Text className="text-red font-ssemibold text-sm">Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} className="">
            {nextEvents.length > 0 ? (
              nextEvents.map((next) => (
                <TouchableOpacity
                  key={next.id}
                  className="h-[180px] aspect-square bg-white rounded-xl mr-4"
                  onPress={() => toEvent(next.id)}
                >
                  <Image
                    src={next?.front_page_image} // Usa el URL de la imagen del evento
                    resizeMode="cover"
                    className="w-full h-full rounded-xl"
                  />
                  <Text className="text-center text-white">{next?.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white">No hay eventos disponibles</Text>
            )}
          </ScrollView>
        </View>

        {/* SPORTS SECTION */}
        {/* Puedes replicar la misma lógica para la sección de deportes */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-ssemibold text-xl">DEPORTES</Text>
            <TouchableOpacity
              onPress={() => toCategory("1c5c51d1-a72b-4561-bcb2-5f38117304a6")}
            >
              <Text className="text-red font-ssemibold text-sm">Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} className="">
            {sportsEvents.length > 0 ? (
              sportsEvents.map((sport) => (
                <TouchableOpacity
                  key={sport.id}
                  className="h-[180px] aspect-square bg-white rounded-xl mr-4"
                  onPress={() => toEvent(sport.id)}
                >
                  <Image
                    src={sport?.front_page_image} // Usa el URL de la imagen del evento
                    resizeMode="cover"
                    className="w-full h-full rounded-xl"
                  />
                  <Text className="text-center text-white">{sport?.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white">No hay eventos disponibles</Text>
            )}
          </ScrollView>
        </View>

        {/* CULTURAL SECTION */}
        {/* Puedes replicar la misma lógica para la sección de deportes */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-ssemibold text-xl">CONCIERTOS</Text>
            <TouchableOpacity
              onPress={() => toCategory("bdd23728-2238-4e2f-9058-5e0f15f08f90")}
            >
              <Text className="text-red font-ssemibold text-sm">Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} className="">
            {culturalEvents.length > 0 ? (
              culturalEvents.map((cultural) => (
                <TouchableOpacity
                  key={cultural.id}
                  className="h-[180px] aspect-square bg-white rounded-xl mr-4"
                  onPress={() => toEvent(cultural.id)}
                >
                  <Image
                    src={cultural?.front_page_image} // Usa el URL de la imagen del evento
                    resizeMode="cover"
                    className="w-full h-full rounded-xl"
                  />
                  <Text className="text-center text-white">
                    {cultural?.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white">No hay eventos disponibles</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

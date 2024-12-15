import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useGlobalSearchParams } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { images } from "../../constants";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import TicketModal from "./[id]/ticketModal";
import useAuthGuard from "../../hooks/useAuthGuard";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
  portal_id: string;
  latitude: string;
  longitude: string;
}

interface ScheduleType {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

const Event = () => {
  const { id } = useGlobalSearchParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(API_URL + "/event", {
          params: {
            id: id,
            status_id: 1,
          },
        });
        setEvent(response.data[0]);
      } catch (err) {
        setError("Error al cargar los detalles del evento");
      } finally {
        setLoading(false);
      }
    };

    if (id && event === null) {
      fetchEventDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchEventSchedule = async () => {
      try {
        const response = await axios.get(API_URL + "/schedure", {
          params: {
            event_id: id,
          },
        });
        setSchedule(response.data);
      } catch (err) {
        setError("Error al cargar el horario del evento");
      }
    };

    if (id && event !== null) {
      fetchEventSchedule();
    }
  }, [event]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray">
        <ActivityIndicator size={"large"} color="#ffffff" />
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

  const checkAuth = useAuthGuard();

  const handleBuyTickets = () => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      setModalVisible(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  return (
    <SafeAreaView className="flex-1 bg-gray -mt-6">
      {event && (
        <>
          <ScrollView className="overflow-visible">
            <View className="w-[100vw] -mt-16">
              <Image
                src={event.front_page_image}
                resizeMode="cover"
                className="w-full h-[45vh]"
              />
              <Image
                source={images.gradient}
                resizeMode="cover"
                className="w-[100vw] h-[45vh] absolute top-0"
              />
            </View>
            <View className="p-4">
              <View className="mt-2">
                <Text className="text-white text-3xl font-sbold">
                  {event.name}
                </Text>
                <View className="mt-2">
                  <Text className="text-gray-400">📍{event.address}</Text>
                </View>
              </View>

              {/* Fechas */}
              <View className="mt-4">
                <Text className="text-white text-lg font-sbold">Fechas</Text>
                <View className="flex-row flex-wrap">
                  {schedule.map((item, index) => {
                    const { day, month } = formatDate(item.date);
                    return (
                      <View
                        key={index}
                        className="bg-gray-200 p-2 mr-2 rounded-lg h-14 w-14 justify-center items-center"
                      >
                        <Text className="text-white text-lg font-bold">
                          {day}
                        </Text>
                        <Text className="text-gray-400 text-sm">{month}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Mapa */}
              <View className="w-full mt-2 mb-24 rounded-lg overflow-hidden">
                <MapView
                  className="w-full h-64"
                  initialRegion={{
                    latitude: parseFloat(event.latitude),
                    longitude: parseFloat(event.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(event.latitude),
                      longitude: parseFloat(event.longitude),
                    }}
                    title={event.name}
                    description={event.address}
                  />
                </MapView>
              </View>
            </View>
          </ScrollView>

          <View className="absolute p-4 bottom-0 w-[100vw] bg-gray h-28 flex justify-center items-center rounded-t-3xl">
            <TouchableOpacity
              className="bg-red-500 p-4 absolute w-full rounded-xl bottom-8"
              onPress={handleBuyTickets}
            >
              <Text className="text-white text-center text-lg font-sbold">
                Comprar Entradas
              </Text>
            </TouchableOpacity>
          </View>

          {/* MODAL */}
          <TicketModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            eventId={id?.toString()}
            eventName={event.name}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Event;

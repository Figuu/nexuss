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
import { images } from "../../constants";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import TicketModal from "./[id]/ticketModal";
import useAuthGuard from "../../hooks/useAuthGuard";
import EventDetailSkeleton from "../../components/skeletons/EventDetailSkeleton";

// Free Map Component using react-native-maps with OpenStreetMap
const FreeMapView = ({ latitude, longitude, title, description }: any) => {
  // Conditional import for MapView
  let MapView: any = null;
  let Marker: any = null;

  try {
    const MapsModule = require("react-native-maps");
    MapView = MapsModule.default;
    Marker = MapsModule.Marker;
  } catch (error) {
    console.warn("react-native-maps not available:", error);
  }

  if (!MapView) {
    return (
      <View className="w-full h-64 bg-gray-800 rounded-lg justify-center items-center">
        <Text className="text-white text-center mb-2">📍 {title}</Text>
        <Text className="text-gray-300 text-center text-sm">{description}</Text>
        <Text className="text-gray-400 text-center text-xs mt-2">
          Coordenadas: {latitude}, {longitude}
        </Text>
      </View>
    );
  }

  return (
    <MapView
      className="w-full h-64"
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      mapType="standard"
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={true}
      showsTraffic={false}
      showsBuildings={true}
      showsIndoors={true}
      showsIndoorLevelPicker={false}
      showsPointsOfInterest={true}
      showsMapToolbar={false}
      toolbarEnabled={false}
      loadingEnabled={true}
      loadingIndicatorColor="#ffffff"
      loadingBackgroundColor="#242424"
      moveOnMarkerPress={true}
      pitchEnabled={true}
      rotateEnabled={true}
      scrollEnabled={true}
      zoomEnabled={true}
      zoomTapEnabled={true}
      zoomControlEnabled={true}
      liteMode={false}
      mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        title={title}
        description={description}
        pinColor="#FE4949"
        opacity={1}
        draggable={false}
        tracksViewChanges={false}
      />
    </MapView>
  );
};

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

  const checkAuth = useAuthGuard();

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
      <SafeAreaView className="flex-1 bg-background">
        <EventDetailSkeleton />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text className="text-white">{error}</Text>
      </SafeAreaView>
    );
  }

  

  const handleBuyTickets = () => {
    if (checkAuth()) {
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
    <SafeAreaView className="flex-1 bg-background -mt-6">
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
                  <Text className="text-white-100">📍{event.address}</Text>
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
                        className="bg-background-card p-2 mr-2 rounded-lg h-14 w-14 justify-center items-center"
                      >
                        <Text className="text-white text-lg font-sbold">
                          {day}
                        </Text>
                        <Text className="text-white-100 text-sm">{month}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Mapa */}
              <View className="w-full mt-2 mb-24 rounded-lg overflow-hidden">
                {event.latitude && event.longitude ? (
                  <FreeMapView
                    latitude={parseFloat(event.latitude)}
                    longitude={parseFloat(event.longitude)}
                    title={event.name}
                    description={event.address}
                  />
                ) : (
                  <View className="w-full h-64 bg-gray-800 rounded-lg justify-center items-center">
                    <Text className="text-white text-center mb-2">📍 {event.name}</Text>
                    <Text className="text-gray-300 text-center text-sm">{event.address}</Text>
                    <Text className="text-gray-400 text-center text-xs mt-2">
                      Coordenadas: {event.latitude}, {event.longitude}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View className="absolute p-4 bottom-0 w-[100vw] bg-background h-28 flex justify-center items-center rounded-t-3xl">
            <TouchableOpacity
              className="bg-primary p-4 absolute w-full rounded-xl bottom-8"
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
            event={event}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Event;

import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCardLarge from "../../components/eventCard/EventCardLarge";
import PortalCard from "../../components/portalCard/PortalCard";
import { API_URL } from "../context/AuthContext";
import axios from "axios";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
}

interface PortalType {
  id: string;
  title: string;
  cover_image: string;
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [portals, setPortals] = useState<PortalType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showingEvents, setShowingEvents] = useState(true); // Nuevo estado para alternar entre eventos y portales

  useEffect(() => {
    if (showingEvents) {
      fetchEvents();
    } else {
      fetchPortals();
    }
  }, [searchQuery, showingEvents]);

  // Función para obtener eventos desde la API
  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL + "/event", {
        params: {
          status_id: 1,
          name: searchQuery,
        },
      });
      setEvents(response.data);
    } catch (err) {
      setError("Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener portales desde la API
  const fetchPortals = async () => {
    try {
      const response = await axios.get(API_URL + "/portal", {
        params: {
          title: searchQuery,
          is_service: false,
        },
      });
      setPortals(response.data);
      // console.log(response.data);
    } catch (err) {
      setError("Error al cargar los portales");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView className="bg-gray h-full px-4">
      <View className="bg-black-100 flex-row mb-2 h-[7vh] rounded-xl items-center px-3">
        <FontAwesome name="search" size={24} color="grey" />
        <TextInput
          className="flex-1 p-3 text-white font-ssemibold text-xl "
          placeholder="Eventos o artistas"
          placeholderTextColor={"grey"}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View className="flex-row">
          <TouchableOpacity
            className={`p-2 rounded-lg mr-1 ${
              showingEvents ? "bg-red" : "bg-gray-600"
            }`}
            onPress={() => setShowingEvents(true)} // Cambia a mostrar eventos
          >
            <Text className="text-white font-sbold">Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2 rounded-lg ${
              !showingEvents ? "bg-red" : "bg-gray-600"
            }`}
            onPress={() => setShowingEvents(false)} // Cambia a mostrar portales
          >
            <Text className="text-white font-sbold">Portales</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="justify-center h-max mb-[5vh]">
        <ScrollView className="">
          {loading ? (
            <Text className="text-white">Cargando...</Text>
          ) : showingEvents ? (
            events?.map((event) => (
              <EventCardLarge key={event.id} event={event} />
            ))
          ) : (
            portals?.map((portal) => (
              <PortalCard key={portal.id} portal={portal} />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Explore;

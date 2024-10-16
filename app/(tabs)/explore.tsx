import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, TextInput, ScrollView } from "react-native";
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

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [loading, setLoading] = useState(true); // Para mostrar un loader mientras se cargan los eventos
  const [error, setError] = useState(""); // Manejar posibles errores de la API

  useEffect(() => {
    // Función para obtener eventos desde la API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL + "/event", {
          params: {
            status_id: 1,
            name: searchQuery,
          },
        });
        // console.log("response", response.data);
        setEvents(response.data);
      } catch (err) {
        setError("Error al cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents(); // Llama a la función para cargar los eventos al montar el componente
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView className="bg-gray h-max px-4">
      <View className="bg-black-100 flex-row mb-4 rounded-xl items-center px-3">
        <FontAwesome name="search" size={24} color="grey" />
        <TextInput
          className="w-full max-w-xs p-3 items-center justify-center text-white font-ssemibold text-xl pb-4"
          placeholder="Eventos o artistas"
          placeholderTextColor={"grey"}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View className="justify-center h-full">
        <ScrollView>
          {events?.map((event) => (
            <EventCardLarge key={event.id} event={event} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Explore;

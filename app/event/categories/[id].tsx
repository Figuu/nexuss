import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import EventCardLarge from "../../../components/eventCard/EventCardLarge";
import { useGlobalSearchParams } from "expo-router";
import { API_URL } from "../../context/AuthContext";
import axios from "axios";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
}

const EventCategories = () => {
  const { id } = useGlobalSearchParams();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useState(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL + "/event", {
          params: {
            portal_type: id,
            status_id: 1,
          },
        });
        setEvents(response.data);
      } catch (err) {
        setError("Error al cargar los eventos");
      }
    };
    if (id && events === null) {
      fetchEvents();
    }
  });

  return (
    <SafeAreaView className="bg-gray h-max px-4">
      <View className="justify-center h-full">
        <ScrollView>
          {events?.map((event) => (
            <EventCardLarge key={event?.id} event={event} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EventCategories;

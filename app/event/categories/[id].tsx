import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import EventCardLarge from "../../../components/eventCard/EventCardLarge";
import EventCardSkeleton from "../../../components/skeletons/EventCardSkeleton";
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

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    if (id && events === null) {
      fetchEvents();
    }
  }, [id]);

  return (
    <SafeAreaView className="bg-background h-max px-4">
      <View className="justify-center h-full">
        <ScrollView>
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 5 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          ) : events?.map((event) => (
            <EventCardLarge key={event?.id} event={event} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EventCategories;

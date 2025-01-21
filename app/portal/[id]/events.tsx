import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API_URL } from "../../context/AuthContext";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

const PortalEvents = () => {
  const route = useRoute();
  const { id } = route.params as { id: string }; 
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/portal/${id}`);
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity className="p-4 mb-4 bg-white rounded-lg shadow">
      <Text className="text-lg font-bold">{item.name}</Text>
      <Text className="text-sm text-gray-light">{item.date}</Text>
      <Text className="text-sm text-gray-light">{item.location}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size={'large'} color="#ffffff" className="mt-10" />;
  }

  return (
    <View className="flex-1 p-4 bg-background">
      {events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <Text className="text-center text-gray-light mt-10">No hay eventos disponibles</Text>
      )}
    </View>
  );
};

export default PortalEvents;

import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "../../constants";
import { router } from "expo-router";

interface Event {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
}

const EventCardLarge = ({ event }: { event: Event }) => {
  const handlePress = () => {
    router.push(`event/${event.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row w-full bg-background-card rounded-xl mb-2 "
    >
      <View className="h-[120px] aspect-square bg-white rounded-xl mr-4">
        <Image
          src={event?.front_page_image}
          resizeMode="cover"
          className="w-full h-full rounded-xl"
        />
      </View>
      <View className="flex-1 mr-2">
        <Text
          className="text-white font-sbold text-lg"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {event.name}
        </Text>
        <Text className="text-white-100 mt-2">📍{event.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCardLarge;

import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";

const PortalCard = ({ portal }) => {
  const handlePress = () => {
    router.push(`portal/${portal.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row w-full bg-black-100 rounded-xl mb-2 "
    >
      <View className="h-[120px] aspect-square bg-white rounded-xl mr-4">
        <Image
          src={portal?.cover_image}
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
          {portal.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PortalCard;

import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ticketsData = [
  { id: '1', title: 'Concierto de Rock', date: '2024-09-20' },
  { id: '2', title: 'Feria de Tecnología', date: '2024-10-05' },
  { id: '3', title: 'Obra de Teatro', date: '2024-10-15' },
  // Agrega más tickets según sea necesario
];

const TicketItem = ({ title, date }: { title: string; date: string }) => (
  <TouchableOpacity className="bg-gray-200 border border-gray rounded-lg p-4 mb-4">
    <Text className="text-lg text-white font-ssemibold">{title}</Text>
    <Text className="text-gray-300">{date}</Text>
  </TouchableOpacity>
);

const Tickets = () => {
  const renderItem = ({ item }: { item: { id: string; title: string; date: string } }) => (
    <TicketItem title={item.title} date={item.date} />
  );

  return (
    <SafeAreaView className="h-full flex-1 bg-gray">
      <View className="px-4 mt-4">
        <FlatList
          data={ticketsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Tickets;

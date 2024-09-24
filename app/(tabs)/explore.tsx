import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Aquí puedes agregar la lógica para manejar la búsqueda
  };

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <View className="px-4 mt-4">
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base"
          placeholder="Buscar eventos, artistas, lugares..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </SafeAreaView>
  );
};

export default Explore;

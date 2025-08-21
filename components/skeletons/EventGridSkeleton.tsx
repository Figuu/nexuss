import React from 'react';
import { View, ScrollView } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const EventGridSkeleton = ({ count = 3 }) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="mr-4">
          <View className="h-[180px] aspect-square bg-background-card rounded-xl overflow-hidden">
            <SkeletonLoader width="100%" height="100%" borderRadius={12} />
          </View>
          <SkeletonLoader 
            width={120} 
            height={16} 
            borderRadius={4} 
            style={{ marginTop: 8, alignSelf: 'center' }} 
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default EventGridSkeleton;

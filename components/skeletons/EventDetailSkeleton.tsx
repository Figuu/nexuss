import React from 'react';
import { View, ScrollView } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const EventDetailSkeleton = () => {
  return (
    <ScrollView className="overflow-visible">
      {/* Hero image skeleton */}
      <View className="w-[100vw]">
        <SkeletonLoader width="100%" height="45vh" borderRadius={0} />
      </View>
      
      <View className="p-4">
        {/* Title skeleton */}
        <View className="mt-2">
          <SkeletonLoader width="80%" height={36} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="60%" height={20} borderRadius={4} />
        </View>

        {/* Dates section skeleton */}
        <View className="mt-4">
          <SkeletonLoader width={80} height={24} borderRadius={4} style={{ marginBottom: 12 }} />
          <View className="flex-row flex-wrap">
            {Array.from({ length: 4 }).map((_, index) => (
              <View
                key={index}
                className="bg-background-card p-2 mr-2 rounded-lg h-14 w-14 justify-center items-center"
              >
                <SkeletonLoader width={20} height={20} borderRadius={4} />
              </View>
            ))}
          </View>
        </View>

        {/* Map skeleton */}
        <View className="w-full mt-2 mb-24 rounded-lg overflow-hidden">
          <SkeletonLoader width="100%" height={200} borderRadius={8} />
        </View>
      </View>
    </ScrollView>
  );
};

export default EventDetailSkeleton;

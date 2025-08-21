import React from 'react';
import { View } from 'react-native';
import SkeletonLoader from '../SkeletonLoader';

const EventCardSkeleton = () => {
  return (
    <View className="flex-row w-full bg-background-card rounded-xl mb-2 p-4">
      {/* Image skeleton */}
      <View className="h-[120px] aspect-square rounded-xl mr-4 overflow-hidden">
        <SkeletonLoader width="100%" height="100%" borderRadius={12} />
      </View>
      
      {/* Content skeleton */}
      <View className="flex-1 mr-2">
        {/* Title skeleton */}
        <SkeletonLoader width="90%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="70%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="50%" height={24} borderRadius={4} style={{ marginBottom: 16 }} />
        
        {/* Address skeleton */}
        <SkeletonLoader width="80%" height={16} borderRadius={4} />
      </View>
    </View>
  );
};

export default EventCardSkeleton;
